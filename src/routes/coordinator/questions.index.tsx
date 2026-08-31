import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CoordShell } from "@/components/coord-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  deleteQuestion,
  duplicateQuestion,
  getCompetition,
  listQuestions,
  reorderQuestions,
  restoreSeedQuestions,
  setQuestionSlot,
} from "@/lib/bughunt/fns";
import type { CompetitionPublic, Question } from "@/lib/bughunt/types";
import { maxMarksOf } from "@/lib/bughunt/scoring";
import { friendlyRpcError } from "@/lib/utils";

export const Route = createFileRoute("/coordinator/questions/")({
  component: QuestionsPage,
});

function QuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [comp, setComp] = useState<CompetitionPublic | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    const [qs, c] = await Promise.all([listQuestions(), getCompetition()]);
    setQuestions(qs);
    setComp(c);
    setLoading(false);
  }

  useEffect(() => {
    void reload().catch((err: unknown) => {
      setLoading(false);
      toast.error(friendlyRpcError(err, "Could not load questions."));
    });
  }, []);

  async function setSlot(id: string, slot: number | null) {
    try {
      await setQuestionSlot({ data: { id, slot } });
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update slot.");
    }
  }

  async function dup(id: string) {
    try {
      const q = await duplicateQuestion({ data: { id } });
      await navigate({ to: "/coordinator/questions/$id", params: { id: q.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Duplicate failed.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this question from the bank?")) return;
    try {
      await deleteQuestion({ data: { id } });
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...questions];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    setQuestions(next);
    try {
      await reorderQuestions({ data: { ids: next.map((q) => q.id) } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reorder.");
      await reload();
    }
  }

  const mixOk = (comp?.pythonCount ?? 0) === 3 && (comp?.cCount ?? 0) === 3;

  return (
    <CoordShell active="questions">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Question bank</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Add, edit, and set the hidden answer key for each debugging question. Select exactly
            six for the live competition: 3 Python and 3 C.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              void restoreSeedQuestions()
                .then(async (res) => {
                  toast.success(
                    res.added
                      ? `Restored ${res.added} starter question${res.added === 1 ? "" : "s"}.`
                      : "Starter questions are already in the bank.",
                  );
                  await reload();
                })
                .catch((err: unknown) =>
                  toast.error(err instanceof Error ? err.message : "Restore failed."),
                )
            }
          >
            Restore starter questions
          </Button>
          <Button asChild>
            <Link to="/coordinator/questions/$id" params={{ id: "new" }}>
              <Plus className="size-4" />
              Add question
            </Link>
          </Button>
        </div>
      </div>

      <div
        className={`mt-5 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
          mixOk
            ? "border-success/30 bg-success/10 text-success"
            : "border-warn/30 bg-warn/10 text-warn"
        }`}
      >
        {comp
          ? mixOk
            ? `Ready: ${comp.pythonCount} Python + ${comp.cCount} C selected for slots 1–6.`
            : `Not ready: currently ${comp.pythonCount} Python + ${comp.cCount} C selected. Choose 3 of each and assign slots Q1–Q6.`
          : "Loading competition mix…"}
      </div>

      <div className="mt-6 grid gap-3">
        {loading ? (
          <p className="text-sm text-muted">Loading question bank…</p>
        ) : questions.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-border px-6 py-12 text-center">
            <p className="font-medium">No questions yet</p>
            <p className="mt-1 text-sm text-muted">
              Add a Python or C debugging question, paste the buggy code, then enter the correct
              answer and scoring errors.
            </p>
            <Button asChild className="mt-4">
              <Link to="/coordinator/questions/$id" params={{ id: "new" }}>
                <Plus className="size-4" />
                Add the first question
              </Link>
            </Button>
          </div>
        ) : (
          questions.map((q, i) => (
            <div
              key={q.id}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 sm:flex-row sm:items-center"
            >
              <div className="flex shrink-0 flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => void move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => void move(i, 1)}
                  disabled={i === questions.length - 1}
                  aria-label="Move down"
                >
                  <ChevronDown className="size-4" />
                </Button>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={q.language === "python" ? "python" : "c"}>
                    {q.language === "python" ? "Python" : "C"}
                  </Badge>
                  {q.selectedSlot ? (
                    <Badge>Slot {q.selectedSlot}</Badge>
                  ) : (
                    <Badge variant="muted">Not selected</Badge>
                  )}
                  <span className="text-xs text-muted">
                    {q.errors.length} errors · {maxMarksOf(q.errors)} marks
                  </span>
                </div>
                <div className="mt-1 font-medium">{q.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {q.correctCode.trim()
                    ? "Answer key saved. Click Edit to update buggy code, correct code, and marks."
                    : "No answer key yet — open Edit to paste the correct code and define errors."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="h-11 rounded-[var(--radius-sm)] border border-border bg-bg px-2 text-sm"
                  value={q.selectedSlot ?? ""}
                  onChange={(e) =>
                    void setSlot(q.id, e.target.value ? Number(e.target.value) : null)
                  }
                  aria-label={`Competition slot for ${q.title}`}
                >
                  <option value="">No slot</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      Q{n}
                    </option>
                  ))}
                </select>
                <Button asChild>
                  <Link to="/coordinator/questions/$id" params={{ id: q.id }}>
                    <Pencil className="size-3.5" />
                    Edit & answer key
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => void dup(q.id)}>
                  <Copy className="size-3.5" />
                  Duplicate
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void remove(q.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </CoordShell>
  );
}
