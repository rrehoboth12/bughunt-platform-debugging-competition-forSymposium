import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuditView } from "@/components/audit-view";
import { CoordShell } from "@/components/coord-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  exportCsv,
  exportDetailed,
  exportJson,
  getCompetition,
  getParticipantReview,
  listCoordinatorParticipants,
} from "@/lib/bughunt/fns";
import type {
  CompetitionPublic,
  CoordinatorParticipantRow,
  ParticipantReview,
} from "@/lib/bughunt/types";
import { cn, formatDuration, friendlyRpcError, rankLabel } from "@/lib/utils";

export const Route = createFileRoute("/coordinator/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [rows, setRows] = useState<CoordinatorParticipantRow[]>([]);
  const [comp, setComp] = useState<CompetitionPublic | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [review, setReview] = useState<ParticipantReview | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([listCoordinatorParticipants(), getCompetition()]).then(
      ([people, c]) => {
        setRows(people);
        setComp(c);
      },
    );
  }, []);

  useEffect(() => {
    if (!openId) {
      setReview(null);
      setReviewError(null);
      return;
    }
    setReview(null);
    setReviewError(null);
    void getParticipantReview({ data: { id: openId } })
      .then(setReview)
      .catch((err: unknown) =>
        setReviewError(err instanceof Error ? err.message : "Could not load audit."),
      );
  }, [openId]);

  async function downloadCsv() {
    try {
      const file = await exportCsv();
      triggerDownload(file.filename, file.csv, "text/csv");
    } catch (err) {
      toast.error(friendlyRpcError(err, "Export failed."));
    }
  }

  async function downloadJson() {
    try {
      const file = await exportJson();
      triggerDownload(file.filename, file.json, "application/json");
    } catch (err) {
      toast.error(friendlyRpcError(err, "Export failed."));
    }
  }

  async function downloadDetailed() {
    try {
      const file = await exportDetailed();
      triggerDownload(file.filename, file.text, "text/plain");
    } catch (err) {
      toast.error(friendlyRpcError(err, "Export failed."));
    }
  }

  const ranked = [...rows].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));

  return (
    <CoordShell active="results">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Results</h1>
          <p className="text-sm text-muted">
            {comp
              ? `Competition ${comp.status} · ${comp.pythonCount} Python + ${comp.cCount} C selected`
              : "Loading…"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void downloadCsv()}>
            <Download className="size-3.5" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => void downloadJson()}>
            <Download className="size-3.5" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => void downloadDetailed()}>
            <Download className="size-3.5" />
            Answer report
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-primary/30 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Question bank & answer keys</h2>
          <p className="mt-1 text-sm text-muted">
            Update buggy programs, paste the correct answers, and set marks for each error.
            {comp
              ? ` Current mix: ${comp.pythonCount} Python + ${comp.cCount} C selected.`
              : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/coordinator/questions">
              <Pencil className="size-3.5" />
              Manage questions
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/coordinator/questions/$id" params={{ id: "new" }}>
              <Plus className="size-3.5" />
              Add question
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-border">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-bg-subtle text-[11px] uppercase tracking-[0.12em] text-muted">
            <tr>
              {[
                "Rank",
                "Name",
                "Dept",
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
                "Time",
                "Status",
                "Malpractice",
              ].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.length === 0 ? (
              <tr>
                <td colSpan={17} className="px-3 py-8 text-center text-muted">
                  No participants yet.
                </td>
              </tr>
            ) : (
              ranked.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setOpenId(r.id)}
                  className={cn(
                    "cursor-pointer border-t border-border transition-colors hover:bg-bg-subtle",
                    r.rank === 1
                      ? "bg-gold/10 ring-1 ring-inset ring-gold/70"
                      : r.rank === 2
                        ? "bg-silver/10 ring-1 ring-inset ring-silver/70"
                        : r.rank === 3
                          ? "bg-bronze/10 ring-1 ring-inset ring-bronze/70"
                          : "bg-bg-elevated",
                  )}
                >
                  <td className="px-3 py-2 font-mono">
                    {r.rank ? rankLabel(r.rank) : "—"}
                  </td>
                  <td className="px-3 py-2 font-medium">{r.fullName}</td>
                  <td className="px-3 py-2 text-muted">{r.department}</td>
                  <td className="px-3 py-2 text-muted">{r.year}</td>
                  <td className="px-3 py-2 text-muted">{r.email}</td>
                  <td className="px-3 py-2 text-muted">{r.phone}</td>
                  <td className="max-w-36 truncate px-3 py-2 text-muted">{r.college}</td>
                  {r.qMarks.slice(0, 6).map((m, i) => (
                    <td key={i} className="px-3 py-2 tabular-nums">
                      {m}
                    </td>
                  ))}
                  <td className="px-3 py-2 font-medium tabular-nums">{r.totalMarks}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {formatDuration(r.durationMs)}
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      variant={
                        r.status === "submitted"
                          ? "success"
                          : r.status === "terminated"
                            ? "danger"
                            : r.status === "in_progress"
                              ? "warn"
                              : "muted"
                      }
                    >
                      {r.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{r.malpracticeCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(openId)} onOpenChange={(open) => !open && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Winner audit</DialogTitle>
            <DialogDescription>
              Original buggy code versus the participant submission, with a point breakdown of
              each configured bug.
            </DialogDescription>
          </DialogHeader>
          {reviewError ? <p className="text-sm text-danger">{reviewError}</p> : null}
          {!review && !reviewError ? (
            <p className="text-sm text-muted">Loading verification record…</p>
          ) : null}
          {review ? <AuditView data={review} /> : null}
        </DialogContent>
      </Dialog>
    </CoordShell>
  );
}

function triggerDownload(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
