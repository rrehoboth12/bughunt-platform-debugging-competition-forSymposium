import { randomBytes } from "node:crypto";
import { getSql } from "@/lib/db";
import {
  answerStatus,
  evaluateErrors,
  marksFromFixed,
  maxMarksOf,
  parseRule,
  rulePasses,
  unionFixedIds,
} from "./scoring";
import { executeAgainstTests } from "./execute.server";
import { ensureSeeded, insertMissingSeedQuestions } from "./seed.server";
import {
  clearSession,
  createSession,
  isCoordinatorCode,
  matchParticipantTrack,
  readSession,
} from "./session.server";
import type {
  AnswerPublic,
  AnswerStatus,
  AnswerKeyReport,
  CompetitionPublic,
  CompetitionStatus,
  CoordinatorParticipantRow,
  ErrorReview,
  Language,
  MalpracticeEvent,
  MalpracticePolicy,
  MeResponse,
  ParticipantPublic,
  ParticipantReview,
  ParticipantStatus,
  PublicQuestion,
  Question,
  QuestionError,
  QuestionReview,
  RegisterResult,
  SubmitResult,
  TestCase,
  TestRunResult,
  ValidationRule,
} from "./types";

function nid(): string {
  return randomBytes(12).toString("hex");
}

function asBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (v === 1 || v === "t" || v === "true" || v === "1") return true;
  return false;
}

function asIso(v: unknown): string | null {
  if (v == null || v === "") return null;
  if (v instanceof Date) return v.toISOString();
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? String(v) : d.toISOString();
}

function asInt(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string") {
    if (raw && typeof raw === "object") return raw as T;
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type QRow = {
  id: string;
  title: string;
  language: string;
  description: string;
  buggy_code: string;
  correct_code: string;
  sort_order: number;
  selected_slot: number | null;
  is_active: unknown;
};

type ERow = {
  id: string;
  question_id: string;
  error_type: string;
  description: string;
  location: string;
  expected_correction: string;
  marks: number;
  validation_rule: string;
  sort_order: number;
  is_active: unknown;
};

type TRow = {
  id: string;
  question_id: string;
  visibility: string;
  stdin: string;
  expected_stdout: string;
  sort_order: number;
};

type PRow = {
  id: string;
  full_name: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  college: string;
  access_code_used: string;
  status: string;
  started_at: string | Date | null;
  completed_at: string | Date | null;
  total_marks: number;
  duration_ms: number | null;
  malpractice_count: number;
  current_question: number;
  created_at: string | Date;
};

async function loadQuestions(): Promise<Question[]> {
  const sql = await getSql();
  const qs = await sql<QRow>`select * from questions order by sort_order, title`;
  const es = await sql<ERow>`select * from question_errors order by sort_order`;
  const ts = await sql<TRow>`select * from test_cases order by sort_order`;
  return qs.map((q) => ({
    id: q.id,
    title: q.title,
    language: q.language as Language,
    description: q.description,
    buggyCode: q.buggy_code,
    correctCode: q.correct_code,
    sortOrder: asInt(q.sort_order),
    selectedSlot: q.selected_slot == null ? null : asInt(q.selected_slot),
    isActive: asBool(q.is_active),
    errors: es
      .filter((e) => e.question_id === q.id)
      .map((e) => ({
        id: e.id,
        questionId: e.question_id,
        errorType: e.error_type as QuestionError["errorType"],
        description: e.description,
        location: e.location,
        expectedCorrection: e.expected_correction,
        marks: asInt(e.marks),
        validationRule: parseRule(parseJson(e.validation_rule, {})),
        sortOrder: asInt(e.sort_order),
        isActive: asBool(e.is_active),
      })),
    testCases: ts
      .filter((t) => t.question_id === q.id)
      .map((t) => ({
        id: t.id,
        questionId: t.question_id,
        visibility: t.visibility as TestCase["visibility"],
        stdin: t.stdin,
        expectedStdout: t.expected_stdout,
        sortOrder: asInt(t.sort_order),
      })),
  }));
}

async function getSettingsRow() {
  const sql = await getSql();
  const rows = await sql<{
    timer_minutes: number;
    malpractice_policy: string;
    malpractice_limit: number;
    status: string;
    questions_locked: unknown;
  }>`select * from competition_settings where id = 'default'`;
  const row = rows[0];
  if (!row) {
    return {
      timerMinutes: 45,
      malpracticePolicy: "terminate_after" as MalpracticePolicy,
      malpracticeLimit: 3,
      status: "open" as CompetitionStatus,
      questionsLocked: false,
    };
  }
  return {
    timerMinutes: asInt(row.timer_minutes, 45),
    malpracticePolicy: row.malpractice_policy as MalpracticePolicy,
    malpracticeLimit: asInt(row.malpractice_limit, 3),
    status: row.status as CompetitionStatus,
    questionsLocked: asBool(row.questions_locked),
  };
}

function selectionMeta(questions: Question[]) {
  const selected = questions
    .filter((q) => q.selectedSlot != null)
    .sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
  const pythonCount = selected.filter((q) => q.language === "python").length;
  const cCount = selected.filter((q) => q.language === "c").length;
  const slots = new Set(selected.map((q) => q.selectedSlot));
  const validSlots =
    selected.length === 6 &&
    slots.size === 6 &&
    [1, 2, 3, 4, 5, 6].every((n) => slots.has(n));
  const mixOk = pythonCount === 3 && cCount === 3;
  let startBlockReason: string | null = null;
  if (!validSlots) startBlockReason = "Select exactly six questions in slots 1–6.";
  else if (!mixOk) startBlockReason = "The selected set must contain 3 Python and 3 C questions.";
  return {
    selected,
    pythonCount,
    cCount,
    canStart: validSlots && mixOk,
    startBlockReason,
  };
}

function toPublicQuestion(q: Question, slot: number): PublicQuestion {
  return {
    id: q.id,
    slot,
    title: q.title,
    language: q.language,
    description: q.description,
    buggyCode: q.buggyCode,
    maxMarks: maxMarksOf(q.errors),
    visibleTests: q.testCases
      .filter((t) => t.visibility === "visible")
      .map((t) => ({
        id: t.id,
        stdin: t.stdin,
        expectedStdout: t.expectedStdout,
      })),
  };
}

function toParticipantPublic(
  row: PRow,
  rank: number | null,
): ParticipantPublic {
  return {
    id: row.id,
    fullName: row.full_name,
    department: row.department,
    year: row.year,
    email: row.email,
    phone: row.phone,
    college: row.college,
    status: row.status as ParticipantStatus,
    startedAt: asIso(row.started_at),
    completedAt: asIso(row.completed_at),
    totalMarks: asInt(row.total_marks),
    durationMs: row.duration_ms == null ? null : asInt(row.duration_ms),
    malpracticeCount: asInt(row.malpractice_count),
    currentQuestion: asInt(row.current_question, 1),
    rank,
  };
}

async function loadParticipant(id: string): Promise<PRow | null> {
  const sql = await getSql();
  const rows = await sql<PRow>`select * from participants where id = ${id} limit 1`;
  return rows[0] ?? null;
}

async function computeRanks(): Promise<Map<string, number>> {
  const sql = await getSql();
  const rows = await sql<PRow>`
    select * from participants
    where status in ('submitted', 'terminated')
  `;
  const sorted = [...rows].sort((a, b) => {
    const marks = asInt(b.total_marks) - asInt(a.total_marks);
    if (marks !== 0) return marks;
    const da = a.duration_ms == null ? Number.POSITIVE_INFINITY : asInt(a.duration_ms);
    const db = b.duration_ms == null ? Number.POSITIVE_INFINITY : asInt(b.duration_ms);
    if (da !== db) return da - db;
    const ca = Date.parse(String(a.completed_at ?? "")) || 0;
    const cb = Date.parse(String(b.completed_at ?? "")) || 0;
    return ca - cb;
  });
  const map = new Map<string, number>();
  sorted.forEach((row, i) => map.set(row.id, i + 1));
  return map;
}

async function requireParticipantRow(): Promise<PRow> {
  const session = await readSession();
  if (!session || session.role !== "participant" || !session.participantId) {
    throw new Error("Participant session required.");
  }
  const row = await loadParticipant(session.participantId);
  if (!row) throw new Error("Participant not found.");
  return row;
}

async function requireCoordinator(): Promise<void> {
  const session = await readSession();
  if (!session || session.role !== "coordinator") {
    throw new Error("Coordinator access required.");
  }
}

async function anyExamStarted(): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql<{ n: number }>`
    select count(*)::int as n from participants
    where status in ('in_progress', 'submitted', 'terminated')
  `;
  return asInt(rows[0]?.n) > 0;
}

export async function getMeOp(): Promise<MeResponse> {
  await ensureSeeded();
  const session = await readSession();
  if (!session) return { role: "anonymous" };
  if (session.role === "coordinator") return { role: "coordinator" };
  if (!session.participantId) return { role: "anonymous" };
  const row = await loadParticipant(session.participantId);
  if (!row) return { role: "anonymous" };
  const ranks = await computeRanks();
  return {
    role: "participant",
    participant: toParticipantPublic(row, ranks.get(row.id) ?? null),
  };
}

export async function getCompetitionPublicOp(): Promise<CompetitionPublic> {
  await ensureSeeded();
  const settings = await getSettingsRow();
  const questions = await loadQuestions();
  const meta = selectionMeta(questions);
  return {
    timerMinutes: settings.timerMinutes,
    status: settings.status,
    malpracticePolicy: settings.malpracticePolicy,
    malpracticeLimit: settings.malpracticeLimit,
    questionsLocked: settings.questionsLocked,
    selectedCount: meta.selected.length,
    pythonCount: meta.pythonCount,
    cCount: meta.cCount,
    canStart: meta.canStart && settings.status === "open",
    startBlockReason:
      settings.status !== "open"
        ? settings.status === "closed"
          ? "The competition is closed."
          : "The coordinator has not opened the competition."
        : meta.startBlockReason,
  };
}

export async function registerOp(input: {
  fullName: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  college: string;
  participationCode: string;
}): Promise<RegisterResult> {
  await ensureSeeded();
  if (isCoordinatorCode(input.participationCode)) {
    await createSession("coordinator", null);
    return { kind: "coordinator" };
  }
  const track = matchParticipantTrack(input.participationCode);
  if (!track) {
    throw new Error("Invalid participation code.");
  }
  const fullName = input.fullName.trim();
  const department = input.department.trim();
  const year = input.year.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const college = input.college.trim();
  if (fullName.length < 2) throw new Error("Full name is required.");
  if (department.length < 1) throw new Error("Department is required.");
  if (year.length < 1) throw new Error("Year is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("A valid email is required.");
  if (phone.length < 7) throw new Error("Phone number is required.");
  if (college.length < 2) throw new Error("College name is required.");
  const settings = await getSettingsRow();
  if (settings.status === "closed") {
    throw new Error("The competition is closed.");
  }
  const sql = await getSql();
  const existing = await sql<PRow>`
    select * from participants where lower(email) = ${email} limit 1
  `;
  if (existing[0]) {
    const row = existing[0];
    await createSession("participant", row.id);
    const ranks = await computeRanks();
    return { kind: "participant", participant: toParticipantPublic(row, ranks.get(row.id) ?? null) };
  }
  const id = nid();
  await sql`
    insert into participants (
      id, full_name, department, year, email, phone, college, access_code_used, status
    ) values (
      ${id}, ${fullName}, ${department}, ${year},
      ${email}, ${phone}, ${college}, ${track}, 'registered'
    )
  `;
  await createSession("participant", id);
  const row = await loadParticipant(id);
  if (!row) throw new Error("Registration failed.");
  return { kind: "participant", participant: toParticipantPublic(row, null) };
}

export async function updateDetailsOp(input: {
  fullName: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  college: string;
}): Promise<ParticipantPublic> {
  const row = await requireParticipantRow();
  if (row.status !== "registered") {
    throw new Error("Details can only be edited before confirmation.");
  }
  const sql = await getSql();
  const email = input.email.trim().toLowerCase();
  await sql`
    update participants
    set full_name = ${input.fullName.trim()},
        department = ${input.department.trim()},
        year = ${input.year.trim()},
        email = ${email},
        phone = ${input.phone.trim()},
        college = ${input.college.trim()}
    where id = ${row.id}
  `;
  const next = await loadParticipant(row.id);
  if (!next) throw new Error("Update failed.");
  return toParticipantPublic(next, null);
}

export async function confirmDetailsOp(): Promise<ParticipantPublic> {
  const row = await requireParticipantRow();
  const sql = await getSql();
  if (row.status === "registered") {
    await sql`update participants set status = 'confirmed' where id = ${row.id}`;
  }
  const next = await loadParticipant(row.id);
  if (!next) throw new Error("Confirmation failed.");
  return toParticipantPublic(next, null);
}

export async function coordinatorLoginOp(code: string): Promise<void> {
  await ensureSeeded();
  if (!isCoordinatorCode(code)) {
    throw new Error("Invalid coordinator access code.");
  }
  await createSession("coordinator", null);
}

export async function logoutOp(): Promise<void> {
  await clearSession();
}

async function remainingMs(row: PRow, timerMinutes: number): Promise<number> {
  if (!row.started_at) return timerMinutes * 60 * 1000;
  const start = new Date(row.started_at).getTime();
  const ends = start + timerMinutes * 60 * 1000;
  return ends - Date.now();
}

async function finalizeParticipant(
  row: PRow,
  status: "submitted" | "terminated",
): Promise<PRow> {
  const sql = await getSql();
  const answers = await sql<{ best_marks: number }>`
    select best_marks from exam_answers where participant_id = ${row.id}
  `;
  const total = answers.reduce((sum, a) => sum + asInt(a.best_marks), 0);
  const started = row.started_at ? new Date(row.started_at).getTime() : Date.now();
  const completed = Date.now();
  const duration = Math.max(0, completed - started);
  await sql`
    update participants
    set status = ${status},
        completed_at = ${new Date(completed).toISOString()},
        total_marks = ${total},
        duration_ms = ${duration}
    where id = ${row.id} and status = 'in_progress'
  `;
  const next = await loadParticipant(row.id);
  return next ?? row;
}

export async function startExamOp(): Promise<{
  participant: ParticipantPublic;
  questions: PublicQuestion[];
  answers: AnswerPublic[];
  remainingMs: number;
  serverNow: number;
  endsAt: number;
}> {
  const row = await requireParticipantRow();
  const competition = await getCompetitionPublicOp();
  if (row.status === "submitted" || row.status === "terminated") {
    throw new Error("This examination has already been submitted.");
  }
  if (row.status === "registered") {
    throw new Error("Confirm your details and accept the rules first.");
  }
  if (row.status === "confirmed") {
    if (!competition.canStart) {
      throw new Error(competition.startBlockReason ?? "Competition is not ready.");
    }
    const sql = await getSql();
    const questions = (await loadQuestions()).filter((q) => q.selectedSlot != null);
    const now = new Date().toISOString();
    await sql`
      update participants
      set status = 'in_progress', started_at = ${now}, current_question = 1
      where id = ${row.id} and status = 'confirmed'
    `;
    for (const q of questions) {
      await sql`
        insert into exam_answers (participant_id, question_id, current_code, best_marks, best_fixed, status)
        values (${row.id}, ${q.id}, ${q.buggyCode}, 0, '[]', 'not_attempted')
        on conflict (participant_id, question_id) do nothing
      `;
    }
  }
  return getExamStateOp();
}

export async function getExamStateOp(): Promise<{
  participant: ParticipantPublic;
  questions: PublicQuestion[];
  answers: AnswerPublic[];
  remainingMs: number;
  serverNow: number;
  endsAt: number;
}> {
  const row0 = await requireParticipantRow();
  const settings = await getSettingsRow();
  let row = row0;
  if (row.status === "in_progress") {
    const left = await remainingMs(row, settings.timerMinutes);
    if (left <= 0) {
      row = await finalizeParticipant(row, "submitted");
    }
  }
  if (row.status !== "in_progress" && row.status !== "submitted" && row.status !== "terminated") {
    throw new Error("Examination has not started.");
  }
  const questions = (await loadQuestions())
    .filter((q) => q.selectedSlot != null)
    .sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
  const sql = await getSql();
  const answers = await sql<{
    question_id: string;
    current_code: string;
    best_marks: number;
    status: string;
    last_compile: string | null;
    last_runtime: string | null;
  }>`select * from exam_answers where participant_id = ${row.id}`;
  const answerMap = new Map(answers.map((a) => [a.question_id, a]));
  const publicQuestions = questions.map((q) => toPublicQuestion(q, q.selectedSlot ?? 0));
  const publicAnswers: AnswerPublic[] = questions.map((q) => {
    const a = answerMap.get(q.id);
    const max = maxMarksOf(q.errors);
    return {
      questionId: q.id,
      slot: q.selectedSlot ?? 0,
      currentCode: a?.current_code ?? q.buggyCode,
      bestMarks: asInt(a?.best_marks),
      maxMarks: max,
      status: (a?.status as AnswerStatus) ?? "not_attempted",
      lastCompile: a?.last_compile ?? null,
      lastRuntime: a?.last_runtime ?? null,
    };
  });
  const ranks = await computeRanks();
  const start = row.started_at ? new Date(row.started_at).getTime() : Date.now();
  const endsAt = start + settings.timerMinutes * 60 * 1000;
  const now = Date.now();
  return {
    participant: toParticipantPublic(row, ranks.get(row.id) ?? null),
    questions: publicQuestions,
    answers: publicAnswers,
    remainingMs: Math.max(0, endsAt - now),
    serverNow: now,
    endsAt,
  };
}

export async function saveCodeOp(questionId: string, code: string): Promise<void> {
  const row = await requireParticipantRow();
  if (row.status !== "in_progress") throw new Error("Examination is locked.");
  const sql = await getSql();
  await sql`
    update exam_answers
    set current_code = ${code}
    where participant_id = ${row.id} and question_id = ${questionId}
  `;
}

export async function setCurrentQuestionOp(slot: number): Promise<void> {
  const row = await requireParticipantRow();
  if (row.status !== "in_progress") return;
  const sql = await getSql();
  await sql`update participants set current_question = ${slot} where id = ${row.id}`;
}

export async function runCodeOp(questionId: string, code: string) {
  const row = await requireParticipantRow();
  if (row.status !== "in_progress") throw new Error("Examination is locked.");
  if (!code.trim()) {
    throw new Error("The editor is empty. Restore or type a program before running.");
  }
  const questions = await loadQuestions();
  const q = questions.find((item) => item.id === questionId);
  if (!q) throw new Error("Question not found.");
  const sql = await getSql();
  await sql`
    update exam_answers set current_code = ${code}
    where participant_id = ${row.id} and question_id = ${questionId}
  `;
  const execution = await executeAgainstTests(q.language, code, q.testCases, false);
  await sql`
    update exam_answers
    set last_compile = ${execution.compileOutput || null},
        last_runtime = ${execution.runtimeOutput || execution.error},
        last_tests = ${JSON.stringify(execution.tests)}
    where participant_id = ${row.id} and question_id = ${questionId}
  `;
  return execution;
}

export async function submitAnswerOp(
  questionId: string,
  code: string,
): Promise<SubmitResult> {
  const row = await requireParticipantRow();
  if (row.status !== "in_progress") throw new Error("Examination is locked.");
  if (!code.trim()) {
    throw new Error("The editor is empty. Restore or type a program before submitting.");
  }
  const questions = await loadQuestions();
  const q = questions.find((item) => item.id === questionId);
  if (!q) throw new Error("Question not found.");
  const sql = await getSql();
  const existing = await sql<{
    best_marks: number;
    best_fixed: string;
    status: string;
  }>`
    select best_marks, best_fixed, status from exam_answers
    where participant_id = ${row.id} and question_id = ${questionId}
    limit 1
  `;
  const prevFixed = parseJson<string[]>(existing[0]?.best_fixed, []);
  const evaluation = evaluateErrors(code, q.errors);
  const merged = unionFixedIds(
    prevFixed,
    evaluation.fixed.map((e) => e.id),
  );
  const best = marksFromFixed(q.errors, merged);
  const max = maxMarksOf(q.errors);
  const status = answerStatus(best, max, true);
  const execution = await executeAgainstTests(q.language, code, q.testCases, true);
  const subId = nid();
  await sql`
    insert into submissions (
      id, participant_id, question_id, submitted_code, fixed_errors, unfixed_errors,
      marks_awarded, compile_ok, compile_output, runtime_output, test_results
    ) values (
      ${subId}, ${row.id}, ${questionId}, ${code},
      ${JSON.stringify(evaluation.fixed.map((e) => e.id))},
      ${JSON.stringify(evaluation.unfixed.map((e) => e.id))},
      ${evaluation.marks}, ${execution.compileOk}, ${execution.compileOutput},
      ${execution.runtimeOutput || execution.error}, ${JSON.stringify(execution.tests)}
    )
  `;
  await sql`
    update exam_answers
    set current_code = ${code},
        best_marks = ${best},
        best_fixed = ${JSON.stringify(merged)},
        status = ${status},
        last_submitted_at = ${new Date().toISOString()},
        last_compile = ${execution.compileOutput || null},
        last_runtime = ${execution.runtimeOutput || execution.error},
        last_tests = ${JSON.stringify(execution.tests)}
    where participant_id = ${row.id} and question_id = ${questionId}
  `;
  const all = await sql<{ best_marks: number }>`
    select best_marks from exam_answers where participant_id = ${row.id}
  `;
  const total = all.reduce((sum, a) => sum + asInt(a.best_marks), 0);
  await sql`update participants set total_marks = ${total} where id = ${row.id}`;
  let message = `Awarded ${evaluation.marks} on this attempt. Best for this question is ${best} / ${max}. Previously earned marks are kept.`;
  if (execution.compileOk === false) {
    message = `Compilation failed. Test output was not counted, but ${evaluation.marks} marks from error fixes still apply. Best remains ${best} / ${max}.`;
  } else if (execution.error) {
    message = `The sandbox could not finish running (${execution.error}). Error-fix marks still apply: ${evaluation.marks}. Best ${best} / ${max}.`;
  } else if (best >= max) {
    message = "All configured errors for this question are fixed. Marks locked at the maximum.";
  }
  return {
    marksAwarded: evaluation.marks,
    bestMarks: best,
    maxMarks: max,
    status,
    fixedCount: evaluation.fixed.length,
    unfixedCount: evaluation.unfixed.length,
    execution,
    message,
  };
}

export async function finishExamOp(): Promise<ParticipantPublic> {
  const row = await requireParticipantRow();
  if (row.status === "submitted" || row.status === "terminated") {
    const ranks = await computeRanks();
    return toParticipantPublic(row, ranks.get(row.id) ?? null);
  }
  if (row.status !== "in_progress") {
    throw new Error("Examination has not started.");
  }
  const next = await finalizeParticipant(row, "submitted");
  const ranks = await computeRanks();
  return toParticipantPublic(next, ranks.get(next.id) ?? null);
}

export async function logMalpracticeOp(input: {
  violationType: string;
  questionSlot: number | null;
}): Promise<{ count: number; terminated: boolean; participant?: ParticipantPublic }> {
  const row = await requireParticipantRow();
  if (row.status !== "in_progress") {
    return { count: asInt(row.malpractice_count), terminated: false };
  }
  const settings = await getSettingsRow();
  const sql = await getSql();
  const count = asInt(row.malpractice_count) + 1;
  await sql`
    insert into malpractice_logs (id, participant_id, violation_type, question_slot, violation_count)
    values (${nid()}, ${row.id}, ${input.violationType}, ${input.questionSlot}, ${count})
  `;
  await sql`update participants set malpractice_count = ${count} where id = ${row.id}`;
  let terminate = false;
  if (settings.malpracticePolicy === "immediate") terminate = true;
  if (
    settings.malpracticePolicy === "terminate_after" &&
    count >= settings.malpracticeLimit
  ) {
    terminate = true;
  }
  if (terminate) {
    const next = await finalizeParticipant({ ...row, malpractice_count: count }, "terminated");
    const ranks = await computeRanks();
    return {
      count,
      terminated: true,
      participant: toParticipantPublic(next, ranks.get(next.id) ?? null),
    };
  }
  return { count, terminated: false };
}

export async function getResultOp(): Promise<{
  participant: ParticipantPublic;
  answers: { slot: number; title: string; language: Language; marks: number; maxMarks: number; status: AnswerStatus }[];
  totalMax: number;
}> {
  const row = await requireParticipantRow();
  if (row.status !== "submitted" && row.status !== "terminated") {
    throw new Error("Finish the examination to view results.");
  }
  const questions = (await loadQuestions())
    .filter((q) => q.selectedSlot != null)
    .sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
  const sql = await getSql();
  const answers = await sql<{ question_id: string; best_marks: number; status: string }>`
    select question_id, best_marks, status from exam_answers where participant_id = ${row.id}
  `;
  const map = new Map(answers.map((a) => [a.question_id, a]));
  const ranks = await computeRanks();
  return {
    participant: toParticipantPublic(row, ranks.get(row.id) ?? null),
    answers: questions.map((q) => ({
      slot: q.selectedSlot ?? 0,
      title: q.title,
      language: q.language,
      marks: asInt(map.get(q.id)?.best_marks),
      maxMarks: maxMarksOf(q.errors),
      status: (map.get(q.id)?.status as AnswerStatus) ?? "not_attempted",
    })),
    totalMax: questions.reduce((sum, q) => sum + maxMarksOf(q.errors), 0),
  };
}

export async function listCoordinatorParticipantsOp(): Promise<CoordinatorParticipantRow[]> {
  await requireCoordinator();
  await ensureSeeded();
  const sql = await getSql();
  const people = await sql<PRow>`select * from participants order by created_at`;
  const answers = await sql<{
    participant_id: string;
    question_id: string;
    best_marks: number;
  }>`select participant_id, question_id, best_marks from exam_answers`;
  const questions = (await loadQuestions())
    .filter((q) => q.selectedSlot != null)
    .sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
  const ranks = await computeRanks();
  return people.map((p) => {
    const qMarks = questions.map((q) => {
      const found = answers.find(
        (a) => a.participant_id === p.id && a.question_id === q.id,
      );
      return asInt(found?.best_marks);
    });
    while (qMarks.length < 6) qMarks.push(0);
    return {
      id: p.id,
      rank: ranks.get(p.id) ?? null,
      fullName: p.full_name,
      department: p.department,
      year: p.year,
      email: p.email,
      phone: p.phone,
      college: p.college,
      qMarks,
      totalMarks: asInt(p.total_marks),
      durationMs: p.duration_ms == null ? null : asInt(p.duration_ms),
      status: p.status as ParticipantStatus,
      malpracticeCount: asInt(p.malpractice_count),
      startedAt: asIso(p.started_at),
      completedAt: asIso(p.completed_at),
    };
  });
}

export async function restoreSeedQuestionsOp(): Promise<{ added: number }> {
  await requireCoordinator();
  const added = await insertMissingSeedQuestions();
  return { added };
}

export async function listQuestionsOp(): Promise<Question[]> {
  await requireCoordinator();
  await ensureSeeded();
  return loadQuestions();
}

export async function getQuestionOp(id: string): Promise<Question> {
  await requireCoordinator();
  const questions = await loadQuestions();
  const q = questions.find((item) => item.id === id);
  if (!q) throw new Error("Question not found.");
  return q;
}

export async function saveQuestionOp(input: {
  id?: string;
  title: string;
  language: Language;
  description: string;
  buggyCode: string;
  correctCode: string;
  selectedSlot: number | null;
  isActive: boolean;
  errors: {
    id?: string;
    errorType: "syntax" | "logic";
    description: string;
    location: string;
    expectedCorrection: string;
    marks: number;
    validationRuleJson: string;
    isActive: boolean;
  }[];
  testCases: {
    id?: string;
    visibility: "visible" | "hidden";
    stdin: string;
    expectedStdout: string;
  }[];
}): Promise<{ ok: true; id: string }> {
  await requireCoordinator();
  try {
    const settings = await getSettingsRow();
    if (settings.questionsLocked && (await anyExamStarted())) {
      throw new Error("Questions are locked because the competition has started.");
    }
    const parsedErrors = input.errors.map((err, i) => {
      let rule: ValidationRule;
      try {
        rule = parseRule(JSON.parse(err.validationRuleJson || "{}"));
      } catch {
        throw new Error(`Error ${i + 1} has invalid validation JSON.`);
      }
      return { ...err, validationRule: rule };
    });
    const sql = await getSql();
    const id = input.id && input.id.length > 0 ? input.id : `q-${nid()}`;
    const existing = await sql<QRow>`select * from questions where id = ${id} limit 1`;
    const sortOrder = existing[0] ? asInt(existing[0].sort_order) : Date.now() % 100000;
    if (input.selectedSlot != null) {
      await sql`
        update questions set selected_slot = null
        where selected_slot = ${input.selectedSlot} and id <> ${id}
      `;
    }
    if (existing[0]) {
      await sql`
        update questions
        set title = ${input.title},
            language = ${input.language},
            description = ${input.description},
            buggy_code = ${input.buggyCode},
            correct_code = ${input.correctCode},
            selected_slot = ${input.selectedSlot},
            is_active = ${input.isActive}
        where id = ${id}
      `;
      await sql`delete from question_errors where question_id = ${id}`;
      await sql`delete from test_cases where question_id = ${id}`;
    } else {
      await sql`
        insert into questions (id, title, language, description, buggy_code, correct_code, sort_order, selected_slot, is_active)
        values (${id}, ${input.title}, ${input.language}, ${input.description}, ${input.buggyCode}, ${input.correctCode}, ${sortOrder}, ${input.selectedSlot}, ${input.isActive})
      `;
    }
    for (const [i, err] of parsedErrors.entries()) {
      await sql`
        insert into question_errors (
          id, question_id, error_type, description, location, expected_correction, marks, validation_rule, sort_order, is_active
        ) values (
          ${err.id && err.id.length > 0 ? err.id : `${id}-e${i + 1}`},
          ${id}, ${err.errorType}, ${err.description}, ${err.location}, ${err.expectedCorrection},
          ${Math.max(0, asInt(err.marks, 1))}, ${JSON.stringify(err.validationRule)}, ${i + 1}, ${err.isActive}
        )
      `;
    }
    for (const [i, t] of input.testCases.entries()) {
      await sql`
        insert into test_cases (id, question_id, visibility, stdin, expected_stdout, sort_order)
        values (
          ${t.id && t.id.length > 0 ? t.id : `${id}-t${i + 1}`},
          ${id}, ${t.visibility}, ${t.stdin}, ${t.expectedStdout}, ${i + 1}
        )
      `;
    }
    return { ok: true as const, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save question.";
    throw new Error(message);
  }
}

export async function validateAnswerKeyOp(input: {
  title: string;
  language: Language;
  buggyCode: string;
  correctCode: string;
  errors: {
    id?: string;
    description: string;
    marks: number;
    validationRuleJson: string;
    isActive: boolean;
  }[];
  testCases: {
    id?: string;
    visibility: "visible" | "hidden";
    stdin: string;
    expectedStdout: string;
  }[];
}): Promise<AnswerKeyReport> {
  await requireCoordinator();
  const errors: QuestionError[] = input.errors.map((err, i) => {
    let rule: ValidationRule;
    try {
      rule = parseRule(JSON.parse(err.validationRuleJson || "{}"));
    } catch {
      rule = { type: "contains", value: "" };
    }
    return {
      id: err.id && err.id.length > 0 ? err.id : `tmp-${i + 1}`,
      questionId: "draft",
      errorType: "syntax",
      description: err.description,
      location: "",
      expectedCorrection: "",
      marks: asInt(err.marks, 0),
      validationRule: rule,
      sortOrder: i + 1,
      isActive: err.isActive,
    };
  });
  const tests: TestCase[] = input.testCases.slice(0, 3).map((t, i) => ({
    id: t.id && t.id.length > 0 ? t.id : `tmp-t${i + 1}`,
    questionId: "draft",
    visibility: t.visibility,
    stdin: t.stdin,
    expectedStdout: t.expectedStdout,
    sortOrder: i + 1,
  }));
  const active = errors.filter((e) => e.isActive);
  const errorChecks = active.map((e) => {
    const alreadyPassingOnBuggy = rulePasses(input.buggyCode, e.validationRule);
    const passingOnAnswer = rulePasses(input.correctCode, e.validationRule);
    const healthy = !alreadyPassingOnBuggy && passingOnAnswer;
    let hint = "Healthy: the buggy program fails this check and the answer key passes it.";
    if (alreadyPassingOnBuggy && passingOnAnswer) {
      hint = "This rule already matches the buggy code, so participants would score it without fixing anything. Tighten the pattern.";
    } else if (!passingOnAnswer) {
      hint = "The answer key does not match this rule. Update the correct code or the validation pattern.";
    } else if (alreadyPassingOnBuggy && !passingOnAnswer) {
      hint = "The rule matches the buggy code but not the answer key — invert or rewrite it.";
    }
    return {
      id: e.id,
      description: e.description,
      marks: e.marks,
      alreadyPassingOnBuggy,
      passingOnAnswer,
      healthy,
      hint,
    };
  });
  const execution = await executeAgainstTests(input.language, input.correctCode, tests, true);
  const healthyCount = errorChecks.filter((c) => c.healthy).length;
  const parts = [
    `${healthyCount}/${errorChecks.length} error rules match the answer key.`,
  ];
  if (execution.compileOk === false) {
    parts.push("Answer key did not compile.");
  } else if (execution.error) {
    parts.push(`Sandbox: ${execution.error}`);
  } else if (execution.tests.length > 0) {
    const passed = execution.tests.filter((t) => t.passed).length;
    parts.push(`Tests ${passed}/${execution.tests.length} passed on the answer key.`);
  } else if (execution.ok) {
    parts.push("Answer key ran without a sandbox error.");
  }
  return {
    errorChecks,
    healthyCount,
    totalErrors: errorChecks.length,
    execution,
    summary: parts.join(" "),
  };
}

export async function deleteQuestionOp(id: string): Promise<void> {
  await requireCoordinator();
  if (await anyExamStarted()) {
    throw new Error("Cannot delete questions after participants have started.");
  }
  const sql = await getSql();
  await sql`delete from questions where id = ${id}`;
}

export async function duplicateQuestionOp(id: string): Promise<Question> {
  await requireCoordinator();
  const q = await getQuestionOp(id);
  const saved = await saveQuestionOp({
    title: `${q.title} (copy)`,
    language: q.language,
    description: q.description,
    buggyCode: q.buggyCode,
    correctCode: q.correctCode,
    selectedSlot: null,
    isActive: true,
    errors: q.errors.map((e) => ({
      errorType: e.errorType,
      description: e.description,
      location: e.location,
      expectedCorrection: e.expectedCorrection,
      marks: e.marks,
      validationRuleJson: JSON.stringify(e.validationRule),
      isActive: e.isActive,
    })),
    testCases: q.testCases.map((t) => ({
      visibility: t.visibility,
      stdin: t.stdin,
      expectedStdout: t.expectedStdout,
    })),
  });
  return getQuestionOp(saved.id);
}

export async function setQuestionSlotOp(id: string, slot: number | null): Promise<void> {
  await requireCoordinator();
  const sql = await getSql();
  if (slot != null) {
    await sql`update questions set selected_slot = null where selected_slot = ${slot} and id <> ${id}`;
  }
  await sql`update questions set selected_slot = ${slot} where id = ${id}`;
}

export async function reorderQuestionsOp(ids: string[]): Promise<void> {
  await requireCoordinator();
  const sql = await getSql();
  for (const [i, id] of ids.entries()) {
    await sql`update questions set sort_order = ${i + 1} where id = ${id}`;
  }
}

export async function updateSettingsOp(input: {
  timerMinutes: number;
  malpracticePolicy: MalpracticePolicy;
  malpracticeLimit: number;
  status: CompetitionStatus;
  questionsLocked: boolean;
}): Promise<CompetitionPublic> {
  await requireCoordinator();
  if (input.status === "open") {
    const questions = await loadQuestions();
    const meta = selectionMeta(questions);
    if (!meta.canStart) {
      throw new Error(meta.startBlockReason ?? "Select 3 Python and 3 C questions first.");
    }
  }
  const sql = await getSql();
  await sql`
    update competition_settings
    set timer_minutes = ${Math.max(1, Math.min(180, asInt(input.timerMinutes, 45)))},
        malpractice_policy = ${input.malpracticePolicy},
        malpractice_limit = ${Math.max(1, asInt(input.malpracticeLimit, 3))},
        status = ${input.status},
        questions_locked = ${input.questionsLocked},
        updated_at = ${new Date().toISOString()}
    where id = 'default'
  `;
  return getCompetitionPublicOp();
}

export async function getParticipantReviewOp(id: string): Promise<ParticipantReview> {
  await requireCoordinator();
  const people = await listCoordinatorParticipantsOp();
  const participant = people.find((p) => p.id === id);
  if (!participant) throw new Error("Participant not found.");
  const questions = (await loadQuestions())
    .filter((q) => q.selectedSlot != null)
    .sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
  const sql = await getSql();
  const answers = await sql<{
    question_id: string;
    current_code: string;
    best_marks: number;
    best_fixed: string;
    last_submitted_at: string | Date | null;
    last_compile: string | null;
    last_runtime: string | null;
    last_tests: string | null;
  }>`select * from exam_answers where participant_id = ${id}`;
  const answerMap = new Map(answers.map((a) => [a.question_id, a]));
  const reviews: QuestionReview[] = questions.map((q) => {
    const a = answerMap.get(q.id);
    const fixed = new Set(parseJson<string[]>(a?.best_fixed, []));
    const errors: ErrorReview[] = q.errors.map((e) => ({
      id: e.id,
      errorType: e.errorType,
      description: e.description,
      location: e.location,
      expectedCorrection: e.expectedCorrection,
      marks: e.marks,
      fixed: fixed.has(e.id),
      awarded: fixed.has(e.id) ? e.marks : 0,
    }));
    return {
      questionId: q.id,
      slot: q.selectedSlot ?? 0,
      title: q.title,
      language: q.language,
      buggyCode: q.buggyCode,
      submittedCode: a?.current_code ?? q.buggyCode,
      correctCode: q.correctCode,
      errors,
      marksAwarded: asInt(a?.best_marks),
      maxMarks: maxMarksOf(q.errors),
      submittedAt: asIso(a?.last_submitted_at ?? null),
      compileOutput: a?.last_compile ?? null,
      runtimeOutput: a?.last_runtime ?? null,
      testResults: parseJson<TestRunResult[]>(a?.last_tests, []),
    };
  });
  const logs = await sql<{
    id: string;
    violation_type: string;
    occurred_at: string | Date;
    question_slot: number | null;
    violation_count: number;
  }>`
    select * from malpractice_logs where participant_id = ${id} order by occurred_at
  `;
  const malpractice: MalpracticeEvent[] = logs.map((l) => ({
    id: l.id,
    violationType: l.violation_type,
    occurredAt: asIso(l.occurred_at) ?? "",
    questionSlot: l.question_slot == null ? null : asInt(l.question_slot),
    violationCount: asInt(l.violation_count),
  }));
  return { participant, questions: reviews, malpractice };
}

export async function exportCsvOp(): Promise<{ filename: string; csv: string }> {
  await requireCoordinator();
  const rows = await listCoordinatorParticipantsOp();
  const header = [
    "Rank",
    "Name",
    "Department",
    "Year",
    "Email",
    "Phone",
    "College",
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "Q5",
    "Q6",
    "Total",
    "CompletionTimeMs",
    "Status",
    "Malpractice",
  ];
  const lines = [header.join(",")];
  const esc = (v: string | number | null) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  for (const r of [...rows].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999))) {
    lines.push(
      [
        r.rank,
        r.fullName,
        r.department,
        r.year,
        r.email,
        r.phone,
        r.college,
        ...r.qMarks.slice(0, 6),
        r.totalMarks,
        r.durationMs,
        r.status,
        r.malpracticeCount,
      ]
        .map(esc)
        .join(","),
    );
  }
  return { filename: "mirai-bug-hunt-results.csv", csv: lines.join("\n") };
}

export async function exportDetailedOp(): Promise<{ filename: string; text: string }> {
  await requireCoordinator();
  const people = await listCoordinatorParticipantsOp();
  const chunks: string[] = ["MIRAI BUG HUNT — detailed answer report", ""];
  for (const p of people) {
    const review = await getParticipantReviewOp(p.id);
    chunks.push("=".repeat(72));
    chunks.push(
      `${p.rank ? `#${p.rank}` : "Unranked"}  ${p.fullName}  ${p.email}  ${p.totalMarks} marks  ${p.status}`,
    );
    for (const q of review.questions) {
      chunks.push("");
      chunks.push(`Q${q.slot} ${q.title} (${q.language})  ${q.marksAwarded}/${q.maxMarks}`);
      chunks.push("-- submitted code --");
      chunks.push(q.submittedCode);
      chunks.push("-- error marking --");
      for (const e of q.errors) {
        chunks.push(
          `  [${e.fixed ? "FIXED" : "OPEN"}] ${e.errorType} ${e.description} (+${e.awarded}/${e.marks})`,
        );
      }
    }
    chunks.push("");
  }
  return { filename: "mirai-bug-hunt-detailed.txt", text: chunks.join("\n") };
}

export async function exportJsonOp(): Promise<{ filename: string; json: string }> {
  await requireCoordinator();
  const people = await listCoordinatorParticipantsOp();
  const payload = [...people]
    .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999))
    .map((p) => ({
      rank: p.rank,
      name: p.fullName,
      department: p.department,
      year: p.year,
      email: p.email,
      phone: p.phone,
      college: p.college,
      q1: p.qMarks[0] ?? 0,
      q2: p.qMarks[1] ?? 0,
      q3: p.qMarks[2] ?? 0,
      q4: p.qMarks[3] ?? 0,
      q5: p.qMarks[4] ?? 0,
      q6: p.qMarks[5] ?? 0,
      totalMarks: p.totalMarks,
      elapsedMs: p.durationMs,
      status: p.status,
      malpractice: p.malpracticeCount,
    }));
  return {
    filename: "mirai-bug-hunt-results.json",
    json: JSON.stringify({ competition: "MIRAI BUG HUNT", exportedAt: new Date().toISOString(), participants: payload }, null, 2),
  };
}

