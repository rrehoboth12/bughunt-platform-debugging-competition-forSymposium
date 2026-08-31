import { Badge } from "@/components/ui/badge";
import type { ParticipantReview } from "@/lib/bughunt/types";
import { formatDuration, rankLabel } from "@/lib/utils";

export function AuditView({ data }: { data: ParticipantReview }) {
  const p = data.participant;
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">{p.fullName}</h2>
        <p className="mt-1 text-sm text-muted">
          {p.department} · Year {p.year} · {p.email} · {p.phone} · {p.college}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Rank" value={p.rank ? rankLabel(p.rank) : "—"} />
        <Stat label="Total" value={String(p.totalMarks)} />
        <Stat label="Time" value={formatDuration(p.durationMs)} />
        <Stat label="Malpractice" value={String(p.malpracticeCount)} />
      </div>

      <div className="flex flex-wrap gap-2">
        {p.qMarks.map((m, i) => (
          <Badge key={i} variant="muted">
            Q{i + 1} {m}
          </Badge>
        ))}
      </div>

      {data.questions.map((q) => (
        <section
          key={q.questionId}
          className="rounded-[var(--radius-lg)] border border-border p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold">
              Q{q.slot} {q.title}
            </h3>
            <Badge variant={q.language === "python" ? "python" : "c"}>
              {q.language === "python" ? "Python" : "C"}
            </Badge>
            <span className="text-sm text-muted">
              {q.marksAwarded}/{q.maxMarks}
            </span>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <CodeBlock label="Original buggy code" code={q.buggyCode} />
            <CodeBlock label="Participant submitted code" code={q.submittedCode} />
          </div>

          <h4 className="mt-4 text-sm font-medium">Point breakdown</h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="py-1 pr-3">Type</th>
                  <th className="py-1 pr-3">Bug</th>
                  <th className="py-1 pr-3">Expected fix</th>
                  <th className="py-1 pr-3">Status</th>
                  <th className="py-1">Marks</th>
                </tr>
              </thead>
              <tbody>
                {q.errors.map((e) => (
                  <tr key={e.id} className="border-t border-border">
                    <td className="py-2 pr-3">{e.errorType}</td>
                    <td className="py-2 pr-3">{e.description}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{e.expectedCorrection}</td>
                    <td className="py-2 pr-3">
                      {e.fixed ? (
                        <span className="text-success">Fixed</span>
                      ) : (
                        <span className="text-muted">Untouched</span>
                      )}
                    </td>
                    <td className="py-2 tabular-nums">
                      {e.awarded}/{e.marks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {data.malpractice.length > 0 ? (
        <section>
          <h3 className="font-display text-lg font-semibold">Malpractice log</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            {data.malpractice.map((m) => (
              <li
                key={m.id}
                className="rounded-[var(--radius-sm)] border border-danger/30 bg-danger/5 px-3 py-2"
              >
                <span className="font-mono text-xs text-muted">{m.occurredAt}</span>
                {" · "}
                {m.violationType}
                {m.questionSlot ? ` · Q${m.questionSlot}` : ""}
                {" · count "}
                {m.violationCount}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-elevated p-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className="mt-1 font-display text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div>
      <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-muted">{label}</div>
      <pre className="max-h-72 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg p-3 font-mono text-[11px] leading-relaxed">
        {code}
      </pre>
    </div>
  );
}
