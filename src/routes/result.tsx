import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandMark, GridBackdrop } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResult } from "@/lib/bughunt/fns";
import type { AnswerStatus, Language, ParticipantPublic } from "@/lib/bughunt/types";
import { formatDuration, rankLabel } from "@/lib/utils";

export const Route = createFileRoute("/result")({ component: ResultPage });

function ResultPage() {
  const [data, setData] = useState<{
    participant: ParticipantPublic;
    answers: {
      slot: number;
      title: string;
      language: Language;
      marks: number;
      maxMarks: number;
      status: AnswerStatus;
    }[];
    totalMax: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getResult()
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Could not load result."),
      );
  }, []);

  if (error) {
    return (
      <main className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <p className="text-sm text-muted">{error}</p>
          <Button asChild className="mt-4">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </main>
    );
  }
  if (!data) {
    return <div className="grid min-h-dvh place-items-center text-muted">Calculating rank…</div>;
  }

  const p = data.participant;
  const terminated = p.status === "terminated";

  return (
    <main className="relative min-h-dvh">
      <GridBackdrop />
      <div className="relative mx-auto max-w-2xl px-5 py-10">
        <BrandMark />
        <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-muted">
          {terminated ? "TEST TERMINATED" : "Examination submitted"}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">{p.fullName}</h1>
        {terminated ? (
          <p className="mt-3 max-w-xl text-sm text-danger">
            A prohibited activity was detected and your examination has been automatically
            submitted.
          </p>
        ) : null}
        <p className="mt-2 text-sm text-muted">
          {p.department} · Year {p.year} · {p.college}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat label="Total" value={`${p.totalMarks}`} hint={`of ${data.totalMax}`} />
          <Stat
            label="Rank"
            value={p.rank ? rankLabel(p.rank) : "—"}
            hint="marks, then time"
          />
          <Stat label="Time" value={formatDuration(p.durationMs)} hint="completion" />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Question scores</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {data.answers.map((a) => (
              <div
                key={a.slot}
                className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border px-3 py-3"
              >
                <span className="font-mono text-xs text-muted">Q{a.slot}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{a.title}</div>
                  <div className="text-[11px] text-muted">
                    {a.language === "python" ? "Python" : "C"}
                  </div>
                </div>
                <Badge
                  variant={
                    a.status === "correct"
                      ? "success"
                      : a.status === "partial"
                        ? "warn"
                        : "muted"
                  }
                >
                  {a.marks}/{a.maxMarks}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {p.malpracticeCount > 0 ? (
          <p className="mt-4 text-sm text-warn">
            Malpractice events recorded: {p.malpracticeCount}
          </p>
        ) : null}

        <Button asChild variant="outline" className="mt-8">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-subtle">{hint}</div>
    </div>
  );
}
