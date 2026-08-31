import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  RotateCcw,
  Send,
  Square,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CodeEditor } from "@/components/code-editor";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  finishExam,
  getExamState,
  logMalpractice,
  runCode,
  saveCode,
  setCurrentQuestion,
  submitAnswer,
} from "@/lib/bughunt/fns";
import type {
  AnswerPublic,
  AnswerStatus,
  ExecutionResult,
  PublicQuestion,
} from "@/lib/bughunt/types";
import { cn, formatClock, friendlyRpcError } from "@/lib/utils";

export const Route = createFileRoute("/exam")({ component: ExamPage });

function statusLabel(status: AnswerStatus) {
  if (status === "correct") return "Correct";
  if (status === "partial") return "Partially Correct";
  if (status === "attempted") return "Attempted";
  return "Not Attempted";
}

function statusTone(status: AnswerStatus) {
  if (status === "correct") return "border-success/50 bg-success/15 text-success";
  if (status === "partial") return "border-partial/50 bg-partial/15 text-partial";
  if (status === "attempted") return "border-warn/50 bg-warn/15 text-warn";
  return "border-border bg-bg-subtle text-muted";
}

function ExamPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerPublic[]>([]);
  const [slot, setSlot] = useState(1);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(0);
  const [output, setOutput] = useState<string>("");
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);
  const [finishOpen, setFinishOpen] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const [fsHeld, setFsHeld] = useState(false);
  const armed = useRef(false);
  const slotRef = useRef(1);
  const lastLog = useRef<Record<string, number>>({});
  const finished = useRef(false);

  const current = questions.find((q) => q.slot === slot) ?? questions[0];
  const currentAnswer = answers.find((a) => a.questionId === current?.id);

  const load = useCallback(async () => {
    try {
      const state = await getExamState();
      if (state.participant.status === "terminated") {
        setTerminated(true);
        return;
      }
      if (state.participant.status === "submitted") {
        await navigate({ to: "/result" });
        return;
      }
      setQuestions(state.questions);
      setAnswers(state.answers);
      setRemaining(Math.ceil(state.remainingMs / 1000));
      setCodes((prev) => {
        const next = { ...prev };
        for (const a of state.answers) {
          if (next[a.questionId] == null) next[a.questionId] = a.currentCode;
        }
        return next;
      });
      setSlot(state.participant.currentQuestion || 1);
      slotRef.current = state.participant.currentQuestion || 1;
    } catch {
      await navigate({ to: "/register" });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      armed.current = true;
    }, 2500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      void el.requestFullscreen().then(() => setFsHeld(true)).catch(() => undefined);
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          if (!finished.current) {
            finished.current = true;
            void finishExam().then(() => navigate({ to: "/result" }));
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [navigate]);

  const report = useCallback(async (violationType: string) => {
    if (!armed.current || finished.current) return;
    const now = Date.now();
    if ((lastLog.current[violationType] ?? 0) > now - 2000) return;
    lastLog.current[violationType] = now;
    try {
      const res = await logMalpractice({
        data: { violationType, questionSlot: slotRef.current },
      });
      if (res.terminated) {
        finished.current = true;
        setTerminated(true);
      }
    } catch {
      /* keep the exam usable if logging fails */
    }
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) void report("visibility");
    };
    const onBlur = () => void report("blur");
    const onFs = () => {
      const on = Boolean(document.fullscreenElement);
      if (!on && fsHeld) void report("fullscreen_exit");
      setFsHeld(on);
    };
    const block = (e: ClipboardEvent, type: string) => {
      e.preventDefault();
      void report(type);
    };
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && key === "r")) {
        e.preventDefault();
        void report("refresh");
      }
      if ((e.ctrlKey || e.metaKey) && (key === "c" || key === "x" || key === "v")) {
        e.preventDefault();
        void report(key === "c" ? "copy" : key === "x" ? "cut" : "paste");
      }
      if (e.key === "PrintScreen") {
        e.preventDefault();
        void report("print_screen");
      }
    };
    const onCopy = (e: ClipboardEvent) => block(e, "copy");
    const onCut = (e: ClipboardEvent) => block(e, "cut");
    const onPaste = (e: ClipboardEvent) => block(e, "paste");
    const onContext = (e: MouseEvent) => {
      e.preventDefault();
      void report("contextmenu");
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      void report("navigation");
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("paste", onPaste);
    document.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", onContext);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", onContext);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [fsHeld, report]);

  async function go(nextSlot: number) {
    if (!current) return;
    const code = codes[current.id] ?? "";
    void saveCode({ data: { questionId: current.id, code } });
    setSlot(nextSlot);
    slotRef.current = nextSlot;
    void setCurrentQuestion({ data: { slot: nextSlot } });
  }

  async function onRun() {
    if (!current) return;
    const source = codes[current.id] ?? "";
    if (!source.trim()) {
      toast.error("The editor is empty. Restore or type a program before running.");
      return;
    }
    setBusy("run");
    try {
      const res: ExecutionResult = await runCode({
        data: { questionId: current.id, code: source },
      });
      const lines = [
        res.compileOk === false ? "Compilation failed. Fix syntax, then run again." : null,
        res.error ? `Sandbox: ${res.error}` : null,
        res.compileOutput ? `Compile:\n${res.compileOutput}` : null,
        res.runtimeOutput ? `Output:\n${res.runtimeOutput}` : null,
        ...res.tests.map(
          (t) =>
            `Test ${t.id.slice(-4)}: ${t.passed ? "PASS" : "FAIL"}${t.stderr ? `\n${t.stderr}` : ""}`,
        ),
      ].filter(Boolean);
      setOutput(lines.join("\n\n") || "No output.");
    } catch (err) {
      setOutput(friendlyRpcError(err, "Run failed."));
      toast.error(friendlyRpcError(err, "Run failed."));
    } finally {
      setBusy(null);
    }
  }

  async function onSubmit() {
    if (!current) return;
    const source = codes[current.id] ?? "";
    if (!source.trim()) {
      toast.error("The editor is empty. Restore or type a program before submitting.");
      return;
    }
    setBusy("submit");
    try {
      const res = await submitAnswer({
        data: { questionId: current.id, code: source },
      });
      toast.success(res.message);
      setAnswers((prev) =>
        prev.map((a) =>
          a.questionId === current.id
            ? { ...a, bestMarks: res.bestMarks, status: res.status }
            : a,
        ),
      );
      const exec = res.execution;
      const testLines = exec.tests.map(
        (t) => `${t.passed ? "PASS" : "FAIL"} ${t.id.slice(-4)}${t.stderr ? `\n${t.stderr}` : ""}`,
      );
      setOutput(
        [
          res.message,
          exec.compileOk === false
            ? "Compilation failed — test output was not counted. Error-fix marks still apply."
            : null,
          exec.error ? `Sandbox: ${exec.error}` : null,
          exec.compileOutput ? `Compile:\n${exec.compileOutput}` : null,
          exec.runtimeOutput ? `Output:\n${exec.runtimeOutput}` : null,
          testLines.length ? `Tests:\n${testLines.join("\n")}` : null,
          `This attempt: ${res.marksAwarded}  ·  Best: ${res.bestMarks}/${res.maxMarks}  ·  Fixed ${res.fixedCount}, remaining ${res.unfixedCount}`,
        ]
          .filter(Boolean)
          .join("\n\n"),
      );
    } catch (err) {
      toast.error(friendlyRpcError(err, "Submit failed. Your previous marks were not reduced."));
    } finally {
      setBusy(null);
    }
  }

  function resetCode() {
    if (!current) return;
    setCodes((prev) => ({ ...prev, [current.id]: current.buggyCode }));
  }

  async function confirmFinish() {
    try {
      finished.current = true;
      if (current) {
        await saveCode({
          data: { questionId: current.id, code: codes[current.id] ?? "" },
        });
      }
      await finishExam();
      await navigate({ to: "/result" });
    } catch (err) {
      finished.current = false;
      toast.error(err instanceof Error ? err.message : "Could not finish.");
    }
  }

  async function reenterFullscreen() {
    try {
      await document.documentElement.requestFullscreen();
      setFsHeld(true);
    } catch {
      toast.error("Fullscreen is blocked in this browser. Stay on this tab.");
    }
  }

  const lowTime = remaining <= 60;
  const code = current ? (codes[current.id] ?? "") : "";
  const nav = useMemo(() => questions, [questions]);

  if (terminated) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
        <div className="max-w-lg rounded-[var(--radius-xl)] border border-danger/40 bg-danger/10 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-danger">
            TEST TERMINATED
          </p>
          <h1 className="mt-4 font-display text-2xl font-semibold leading-snug sm:text-3xl">
            A prohibited activity was detected and your examination has been automatically
            submitted.
          </h1>
          <Button className="mt-6" onClick={() => void navigate({ to: "/result" })}>
            View result
          </Button>
        </div>
      </main>
    );
  }

  if (loading || !current) {
    return (
      <div className="grid min-h-dvh place-items-center text-muted">Loading examination…</div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-bg">
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-3 py-2 sm:px-4">
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold tracking-wide">MIRAI — BUG HUNT</div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted">
            Question {current.slot} / 6
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!fsHeld ? (
            <Button variant="outline" size="sm" onClick={() => void reenterFullscreen()}>
              <Maximize2 className="size-3.5" />
              Fullscreen
            </Button>
          ) : null}
          <div
            className={cn(
              "rounded-[var(--radius-sm)] border px-3 py-1 font-mono text-lg tabular-nums",
              lowTime
                ? "border-danger/40 bg-danger/10 text-danger glow-danger"
                : "border-primary/30 bg-primary/10 text-fg glow-cyan",
            )}
          >
            {formatClock(remaining)}
          </div>
          <Button variant="outline" size="sm" onClick={() => setFinishOpen(true)}>
            <Square className="size-3.5" />
            Finish
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[13rem_minmax(16rem,22rem)_1fr]">
        <aside className="min-h-0 overflow-auto border-b border-border p-3 lg:border-b-0 lg:border-r">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted">Questions</div>
          <div className="mt-2 grid grid-cols-3 gap-2 lg:grid-cols-2">
            {nav.map((q) => {
              const a = answers.find((x) => x.questionId === q.id);
              const status = a?.status ?? "not_attempted";
              const active = q.slot === slot;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => void go(q.slot)}
                  className={cn(
                    "min-h-11 rounded-[var(--radius-sm)] border px-2 py-2 text-left transition-[border-color,background-color,box-shadow] duration-150",
                    statusTone(status),
                    active && "ring-2 ring-primary/70 glow-cyan",
                  )}
                >
                  <div className="font-mono text-xs font-semibold">Q{q.slot}</div>
                  <div className="mt-0.5 text-[10px] leading-tight">{statusLabel(status)}</div>
                </button>
              );
            })}
          </div>
        </aside>

        <aside className="min-h-0 overflow-auto border-b border-border p-4 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={current.language === "python" ? "python" : "c"}>
              {current.language === "python" ? "Python" : "C"}
            </Badge>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary">
              Max {current.maxMarks}
            </span>
            <span className="text-xs text-muted">Best {currentAnswer?.bestMarks ?? 0}</span>
          </div>
          <h2 className="mt-3 font-display text-lg font-semibold leading-snug">{current.title}</h2>
          <Markdown className="mt-3" text={current.description} />
          {current.visibleTests.length > 0 ? (
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted">
                Visible tests
              </div>
              {current.visibleTests.map((t) => (
                <pre
                  key={t.id}
                  className="mt-2 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg-subtle p-3 font-mono text-[11px] text-fg"
                >
                  {t.expectedStdout}
                </pre>
              ))}
            </div>
          ) : null}
        </aside>

        <section className="flex min-h-0 flex-col">
          <div className="min-h-0 flex-1">
            <CodeEditor
              language={current.language}
              value={code}
              onChange={(v) => setCodes((prev) => ({ ...prev, [current.id]: v }))}
            />
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 border-t border-border p-3">
            <Button size="sm" variant="secondary" onClick={() => void onRun()} disabled={!!busy}>
              <Play className="size-3.5" />
              {busy === "run" ? "Running…" : "RUN CODE"}
            </Button>
            <Button size="sm" onClick={() => void onSubmit()} disabled={!!busy}>
              <Send className="size-3.5" />
              {busy === "submit" ? "Submitting…" : "SUBMIT ANSWER"}
            </Button>
            <Button size="sm" variant="outline" onClick={resetCode}>
              <RotateCcw className="size-3.5" />
              RESET CODE
            </Button>
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                disabled={slot <= 1}
                onClick={() => void go(slot - 1)}
              >
                <ChevronLeft className="size-3.5" />
                PREVIOUS
              </Button>
              {slot < 6 ? (
                <Button size="sm" variant="ghost" onClick={() => void go(slot + 1)}>
                  NEXT
                  <ChevronRight className="size-3.5" />
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setFinishOpen(true)}>
                  FINISH TEST
                </Button>
              )}
            </div>
          </div>
          <div className="h-32 shrink-0 overflow-auto border-t border-border bg-bg-elevated p-3 font-mono text-xs whitespace-pre-wrap text-muted">
            {output || "Run or submit to see compiler / runtime output."}
          </div>
        </section>
      </div>

      <AlertDialog open={finishOpen} onOpenChange={setFinishOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finish BUG HUNT?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to finish BUG HUNT? Your answers cannot be changed after
              final submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue exam</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmFinish()}>FINISH TEST</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
