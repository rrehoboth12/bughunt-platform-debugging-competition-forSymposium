export type Language = "python" | "c";
export type ErrorType = "syntax" | "logic";
export type ParticipantStatus =
  | "registered"
  | "confirmed"
  | "in_progress"
  | "submitted"
  | "terminated";
export type AnswerStatus = "not_attempted" | "attempted" | "partial" | "correct";
export type CompetitionStatus = "setup" | "open" | "closed";
export type MalpracticePolicy = "log_only" | "terminate_after" | "immediate";
export type TestVisibility = "visible" | "hidden";

export type ValidationRule =
  | { type: "contains"; value: string; caseSensitive?: boolean }
  | { type: "not_contains"; value: string; caseSensitive?: boolean }
  | { type: "regex"; pattern: string; flags?: string }
  | { type: "all"; rules: ValidationRule[] }
  | { type: "any"; rules: ValidationRule[] };

export type QuestionError = {
  id: string;
  questionId: string;
  errorType: ErrorType;
  description: string;
  location: string;
  expectedCorrection: string;
  marks: number;
  validationRule: ValidationRule;
  sortOrder: number;
  isActive: boolean;
};

export type TestCase = {
  id: string;
  questionId: string;
  visibility: TestVisibility;
  stdin: string;
  expectedStdout: string;
  sortOrder: number;
};

export type Question = {
  id: string;
  title: string;
  language: Language;
  description: string;
  buggyCode: string;
  correctCode: string;
  sortOrder: number;
  selectedSlot: number | null;
  isActive: boolean;
  errors: QuestionError[];
  testCases: TestCase[];
};

export type PublicQuestion = {
  id: string;
  slot: number;
  title: string;
  language: Language;
  description: string;
  buggyCode: string;
  maxMarks: number;
  visibleTests: { id: string; stdin: string; expectedStdout: string }[];
};

export type ParticipantPublic = {
  id: string;
  fullName: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  college: string;
  status: ParticipantStatus;
  startedAt: string | null;
  completedAt: string | null;
  totalMarks: number;
  durationMs: number | null;
  malpracticeCount: number;
  currentQuestion: number;
  rank: number | null;
};

export type AnswerPublic = {
  questionId: string;
  slot: number;
  currentCode: string;
  bestMarks: number;
  maxMarks: number;
  status: AnswerStatus;
  lastCompile: string | null;
  lastRuntime: string | null;
};

export type CompetitionPublic = {
  timerMinutes: number;
  status: CompetitionStatus;
  malpracticePolicy: MalpracticePolicy;
  malpracticeLimit: number;
  questionsLocked: boolean;
  selectedCount: number;
  pythonCount: number;
  cCount: number;
  canStart: boolean;
  startBlockReason: string | null;
};

export type RegisterResult =
  | { kind: "coordinator" }
  | { kind: "participant"; participant: ParticipantPublic };

export type SessionRole = "participant" | "coordinator";

export type MeResponse =
  | { role: "anonymous" }
  | { role: "coordinator" }
  | { role: "participant"; participant: ParticipantPublic };

export type TestRunResult = {
  id: string;
  visibility: TestVisibility;
  passed: boolean;
  expected: string;
  actual: string;
  stderr: string;
};

export type ExecutionResult = {
  ok: boolean;
  compileOk: boolean | null;
  compileOutput: string;
  runtimeOutput: string;
  error: string | null;
  tests: TestRunResult[];
};

export type SubmitResult = {
  marksAwarded: number;
  bestMarks: number;
  maxMarks: number;
  status: AnswerStatus;
  fixedCount: number;
  unfixedCount: number;
  execution: ExecutionResult;
  terminated?: boolean;
  message: string;
};

export type CoordinatorParticipantRow = {
  id: string;
  rank: number | null;
  fullName: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  college: string;
  qMarks: number[];
  totalMarks: number;
  durationMs: number | null;
  status: ParticipantStatus;
  malpracticeCount: number;
  startedAt: string | null;
  completedAt: string | null;
};

export type ErrorReview = {
  id: string;
  errorType: ErrorType;
  description: string;
  location: string;
  expectedCorrection: string;
  marks: number;
  fixed: boolean;
  awarded: number;
};

export type QuestionReview = {
  questionId: string;
  slot: number;
  title: string;
  language: Language;
  buggyCode: string;
  submittedCode: string;
  correctCode: string;
  errors: ErrorReview[];
  marksAwarded: number;
  maxMarks: number;
  submittedAt: string | null;
  compileOutput: string | null;
  runtimeOutput: string | null;
  testResults: TestRunResult[];
};

export type MalpracticeEvent = {
  id: string;
  violationType: string;
  occurredAt: string;
  questionSlot: number | null;
  violationCount: number;
};

export type ParticipantReview = {
  participant: CoordinatorParticipantRow;
  questions: QuestionReview[];
  malpractice: MalpracticeEvent[];
};

export type AnswerKeyErrorCheck = {
  id: string;
  description: string;
  marks: number;
  alreadyPassingOnBuggy: boolean;
  passingOnAnswer: boolean;
  healthy: boolean;
  hint: string;
};

export type AnswerKeyReport = {
  errorChecks: AnswerKeyErrorCheck[];
  healthyCount: number;
  totalErrors: number;
  execution: ExecutionResult;
  summary: string;
};

