import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CodeEditor } from "@/components/code-editor";
import { CoordShell } from "@/components/coord-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getQuestion, saveQuestion, validateAnswerKey } from "@/lib/bughunt/fns";
import { parseRule } from "@/lib/bughunt/scoring";
import type { AnswerKeyReport, Language, ValidationRule } from "@/lib/bughunt/types";
import { friendlyRpcError } from "@/lib/utils";

export const Route = createFileRoute("/coordinator/questions/$id")({
  component: QuestionEditorPage,
});

type RuleKind = "contains" | "not_contains" | "regex" | "json";

type ErrorDraft = {
  id?: string;
  errorType: "syntax" | "logic";
  description: string;
  location: string;
  expectedCorrection: string;
  marks: number;
  ruleType: RuleKind;
  ruleValue: string;
  isActive: boolean;
};

type TestDraft = {
  id?: string;
  visibility: "visible" | "hidden";
  stdin: string;
  expectedStdout: string;
};

function emptyError(): ErrorDraft {
  return {
    errorType: "syntax",
    description: "",
    location: "",
    expectedCorrection: "",
    marks: 2,
    ruleType: "contains",
    ruleValue: "",
    isActive: true,
  };
}

function ruleToDraft(rule: ValidationRule): Pick<ErrorDraft, "ruleType" | "ruleValue"> {
  if (rule.type === "contains" || rule.type === "not_contains") {
    return { ruleType: rule.type, ruleValue: rule.value };
  }
  if (rule.type === "regex") {
    return { ruleType: "regex", ruleValue: rule.pattern };
  }
  return { ruleType: "json", ruleValue: JSON.stringify(rule, null, 2) };
}

function draftToRule(d: ErrorDraft): ValidationRule {
  if (d.ruleType === "regex") return { type: "regex", pattern: d.ruleValue };
  if (d.ruleType === "json") {
    try {
      return parseRule(JSON.parse(d.ruleValue || "{}"));
    } catch {
      throw new Error("One error has invalid JSON validation. Fix it before saving.");
    }
  }
  return { type: d.ruleType, value: d.ruleValue };
}

function QuestionEditorPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<Language>("python");
  const [description, setDescription] = useState("");
  const [buggyCode, setBuggyCode] = useState("");
  const [correctCode, setCorrectCode] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<ErrorDraft[]>(isNew ? [emptyError()] : []);
  const [tests, setTests] = useState<TestDraft[]>([]);
  const [pending, setPending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [report, setReport] = useState<AnswerKeyReport | null>(null);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (isNew) return;
    void getQuestion({ data: { id } })
      .then((q) => {
        setTitle(q.title);
        setLanguage(q.language);
        setDescription(q.description);
        setBuggyCode(q.buggyCode);
        setCorrectCode(q.correctCode);
        setSelectedSlot(q.selectedSlot);
        setIsActive(q.isActive);
        setErrors(
          q.errors.map((e) => ({
            id: e.id,
            errorType: e.errorType,
            description: e.description,
            location: e.location,
            expectedCorrection: e.expectedCorrection,
            marks: e.marks,
            isActive: e.isActive,
            ...ruleToDraft(e.validationRule),
          })),
        );
        setTests(
          q.testCases.map((t) => ({
            id: t.id,
            visibility: t.visibility,
            stdin: t.stdin,
            expectedStdout: t.expectedStdout,
          })),
        );
        setLoaded(true);
      })
      .catch((err: unknown) =>
        toast.error(friendlyRpcError(err, "Could not load question.")),
      );
  }, [id, isNew]);

  function payload() {
    return {
      id: isNew ? undefined : id,
      title: title.trim(),
      language,
      description: description.trim(),
      buggyCode,
      correctCode,
      selectedSlot,
      isActive,
      errors: errors.map((e) => ({
        id: e.id,
        errorType: e.errorType,
        description: e.description,
        location: e.location,
        expectedCorrection: e.expectedCorrection,
        marks: Number.isFinite(e.marks) ? e.marks : 0,
        isActive: e.isActive,
        validationRuleJson: JSON.stringify(draftToRule(e)),
      })),
      testCases: tests,
    };
  }

  function validateForm(): boolean {
    if (title.trim().length < 2) {
      toast.error("Enter a question title.");
      return false;
    }
    if (description.trim().length < 8) {
      toast.error("Enter a short description shown to participants.");
      return false;
    }
    if (!buggyCode.trim()) {
      toast.error("Paste the buggy program participants will debug.");
      return false;
    }
    if (!correctCode.trim()) {
      toast.error("Paste the correct / expected answer code. Participants never see this.");
      return false;
    }
    if (errors.length === 0) {
      toast.error("Add at least one error with an expected correction and marks.");
      return false;
    }
    if (errors.some((e) => !e.description.trim() || !e.expectedCorrection.trim())) {
      toast.error("Every error needs a description and an expected correction.");
      return false;
    }
    try {
      errors.forEach((e) => draftToRule(e));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fix validation rules before saving.");
      return false;
    }
    return true;
  }

  async function save() {
    if (!validateForm()) return;
    setPending(true);
    try {
      const saved = await saveQuestion({ data: payload() });
      toast.success("Question and answer key saved. Checking the answer key…");
      if (isNew) {
        await navigate({ to: "/coordinator/questions/$id", params: { id: saved.id } });
      }
      setChecking(true);
      try {
        const next = await validateAnswerKey({ data: payload() });
        setReport(next);
        toast.success(next.summary);
      } catch (err) {
        toast.error(friendlyRpcError(err, "Saved, but answer-key check could not run."));
      } finally {
        setChecking(false);
      }
    } catch (err) {
      toast.error(friendlyRpcError(err, "Save failed."));
    } finally {
      setPending(false);
    }
  }

  async function checkKey() {
    if (!validateForm()) return;
    setChecking(true);
    try {
      const next = await validateAnswerKey({ data: payload() });
      setReport(next);
      toast.success(next.summary);
    } catch (err) {
      toast.error(friendlyRpcError(err, "Could not check the answer key."));
    } finally {
      setChecking(false);
    }
  }

  if (!loaded) {
    return (
      <CoordShell active="questions">
        <p className="text-muted">Loading question…</p>
      </CoordShell>
    );
  }

  return (
    <CoordShell active="questions">
      <Link
        to="/coordinator/questions"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg"
      >
        <ArrowLeft className="size-3.5" />
        Back to question bank
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {isNew ? "Add question" : "Edit question & answer key"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Participants only see the description and buggy code. The correct program, expected
            corrections, and marks stay coordinator-only.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void checkKey()} disabled={pending || checking}>
            <ShieldCheck className="size-4" />
            {checking ? "Checking…" : "Check answer key"}
          </Button>
          <Button onClick={() => void save()} disabled={pending || checking}>
            {pending ? "Saving…" : "Save question & answers"}
          </Button>
        </div>
      </div>

      <section className="mt-6 grid gap-4">
        <h2 className="font-display text-lg font-semibold">Shown to participants</h2>
        <label className="grid gap-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Debug the Stack Implementation"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2">
            <Label>Language</Label>
            <select
              className="h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="python">Python</option>
              <option value="c">C</option>
            </select>
          </label>
          <label className="grid gap-2">
            <Label>Competition slot</Label>
            <select
              className="h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
              value={selectedSlot ?? ""}
              onChange={(e) =>
                setSelectedSlot(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Not selected</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  Question {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active in bank
          </label>
        </div>
        <label className="grid gap-2">
          <Label>Description shown to participants</Label>
          <Textarea
            className="font-sans"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What the program is supposed to do after the bugs are fixed."
          />
        </label>
        <div className="grid gap-2">
          <Label>Buggy code (starting program)</Label>
          <div className="h-72 overflow-hidden rounded-[var(--radius-sm)] border border-border">
            <CodeEditor language={language} value={buggyCode} onChange={setBuggyCode} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Answer key — coordinator only</h2>
          <p className="mt-1 text-sm text-muted">
            Paste the fully corrected program here. It is used for winner verification and is
            never sent to participant browsers.
          </p>
        </div>
        <div className="h-80 overflow-hidden rounded-[var(--radius-sm)] border border-primary/30">
          <CodeEditor language={language} value={correctCode} onChange={setCorrectCode} />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Errors, expected fixes, and marks</h2>
            <p className="mt-1 text-sm text-muted">
              Each row is one awardable correction. If the submitted code matches the validation
              rule, those marks are added. Nothing is ever deducted.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setErrors((prev) => [...prev, emptyError()])}>
            <Plus className="size-3.5" />
            Add error
          </Button>
        </div>
        <div className="mt-3 grid gap-3">
          {errors.map((err, i) => (
            <div key={err.id ?? `new-${i}`} className="rounded-[var(--radius-md)] border border-border p-4">
              <div className="mb-3 text-xs uppercase tracking-[0.12em] text-muted">
                Error {String(i + 1).padStart(2, "0")}
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <Field label="Type">
                  <select
                    className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
                    value={err.errorType}
                    onChange={(e) =>
                      updateError(i, { errorType: e.target.value as "syntax" | "logic" })
                    }
                  >
                    <option value="syntax">Syntax</option>
                    <option value="logic">Logic</option>
                  </select>
                </Field>
                <Field label="Marks">
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    value={err.marks}
                    onChange={(e) => updateError(i, { marks: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={err.location}
                    onChange={(e) => updateError(i, { location: e.target.value })}
                    placeholder="line 4 / first loop"
                  />
                </Field>
                <div className="flex items-end justify-between gap-2 pb-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={err.isActive}
                      onChange={(e) => updateError(i, { isActive: e.target.checked })}
                    />
                    Active
                  </label>
                  <Button variant="ghost" size="icon" onClick={() => removeError(i)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 grid gap-3">
                <Field label="Description">
                  <Input
                    value={err.description}
                    onChange={(e) => updateError(i, { description: e.target.value })}
                    placeholder="Missing semicolon after the array declaration"
                  />
                </Field>
                <Field label="Expected correction (hidden from participants)">
                  <Input
                    value={err.expectedCorrection}
                    onChange={(e) => updateError(i, { expectedCorrection: e.target.value })}
                    placeholder="int a[6] = {12, 25, 18, 30, 15, 20};"
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                  <Field label="Validation">
                    <select
                      className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
                      value={err.ruleType}
                      onChange={(e) =>
                        updateError(i, {
                          ruleType: e.target.value as ErrorDraft["ruleType"],
                        })
                      }
                    >
                      <option value="contains">Contains</option>
                      <option value="not_contains">Not contains</option>
                      <option value="regex">Regex</option>
                      <option value="json">Advanced JSON</option>
                    </select>
                  </Field>
                  <Field
                    label={
                      err.ruleType === "json"
                        ? "Compound rule JSON"
                        : "Pattern / text that means this error is fixed"
                    }
                  >
                    {err.ruleType === "json" ? (
                      <Textarea
                        className="min-h-24"
                        value={err.ruleValue}
                        onChange={(e) => updateError(i, { ruleValue: e.target.value })}
                      />
                    ) : (
                      <Input
                        className="font-mono"
                        value={err.ruleValue}
                        onChange={(e) => updateError(i, { ruleValue: e.target.value })}
                        placeholder={
                          err.ruleType === "regex" ? "sum\\s*\\+=\\s*a\\s*\\[" : "class Stack"
                        }
                      />
                    )}
                  </Field>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Test cases</h2>
            <p className="mt-1 text-sm text-muted">
              Optional. Used when a participant runs or submits code. Hidden tests are not shown
              in the exam.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setTests((prev) => [
                ...prev,
                { visibility: "visible", stdin: "", expectedStdout: "" },
              ])
            }
          >
            <Plus className="size-3.5" />
            Add test
          </Button>
        </div>
        <div className="mt-3 grid gap-3">
          {tests.map((t, i) => (
            <div key={t.id ?? `t-${i}`} className="rounded-[var(--radius-md)] border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <select
                  className="h-10 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-2 text-sm"
                  value={t.visibility}
                  onChange={(e) =>
                    updateTest(i, {
                      visibility: e.target.value as "visible" | "hidden",
                    })
                  }
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </select>
                <Button variant="ghost" size="icon" onClick={() => removeTest(i)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="stdin">
                  <Textarea
                    value={t.stdin}
                    onChange={(e) => updateTest(i, { stdin: e.target.value })}
                  />
                </Field>
                <Field label="Expected stdout">
                  <Textarea
                    value={t.expectedStdout}
                    onChange={(e) => updateTest(i, { expectedStdout: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      {report ? (
        <section className="mt-8 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4">
          <h2 className="font-display text-lg font-semibold">Answer key check</h2>
          <p className="mt-1 text-sm text-muted">{report.summary}</p>
          <div className="mt-4 grid gap-2">
            {report.errorChecks.map((c) => (
              <div
                key={c.id}
                className={`rounded-[var(--radius-sm)] border px-3 py-2 text-sm ${
                  c.healthy
                    ? "border-success/30 bg-success/10"
                    : "border-warn/30 bg-warn/10"
                }`}
              >
                <div className="font-medium">
                  {c.healthy ? "Ready" : "Needs attention"} · {c.description} · {c.marks} marks
                </div>
                <p className="mt-1 text-xs text-muted">{c.hint}</p>
              </div>
            ))}
          </div>
          {report.execution.compileOutput ? (
            <pre className="mt-3 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg p-3 font-mono text-xs text-muted">
              {report.execution.compileOutput}
            </pre>
          ) : null}
          {report.execution.tests.length > 0 ? (
            <div className="mt-3 grid gap-1 text-xs">
              {report.execution.tests.map((t) => (
                <div key={t.id} className={t.passed ? "text-success" : "text-danger"}>
                  {t.passed ? "PASS" : "FAIL"} · expected {JSON.stringify(t.expected)} · got{" "}
                  {JSON.stringify(t.actual)}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="sticky bottom-4 mt-8 flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={() => void checkKey()} disabled={pending || checking}>
          <ShieldCheck className="size-4" />
          {checking ? "Checking…" : "Check answer key"}
        </Button>
        <Button onClick={() => void save()} disabled={pending || checking} size="lg">
          {pending ? "Saving…" : "Save question & answers"}
        </Button>
      </div>
    </CoordShell>
  );

  function updateError(index: number, patch: Partial<ErrorDraft>) {
    setErrors((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  }
  function removeError(index: number) {
    setErrors((prev) => prev.filter((_, i) => i !== index));
  }
  function updateTest(index: number, patch: Partial<TestDraft>) {
    setTests((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }
  function removeTest(index: number) {
    setTests((prev) => prev.filter((_, i) => i !== index));
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
