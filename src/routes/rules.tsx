import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandMark, GridBackdrop } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompetition, getMe, startExam } from "@/lib/bughunt/fns";

export const Route = createFileRoute("/rules")({ component: RulesPage });

const RULES = [
  "The examination must be conducted in full-screen mode.",
  "Switching browser tabs, minimizing the browser, changing windows, or leaving the examination page is considered malpractice.",
  "Refreshing the page using F5 or browser refresh is prohibited.",
  "Copying, cutting, and pasting are prohibited.",
  "Print Screen and screenshot shortcuts are monitored where the browser can detect them.",
  "Remain on the examination page for the entire duration.",
  "Submit each program with SUBMIT ANSWER. End the exam with FINISH TEST before the timer ends.",
  "There is NO NEGATIVE MARKING. You receive marks for every error you successfully correct. Incorrect attempts do not deduct previously earned marks.",
  "If participants have the same final marks, completion time is the tie-breaker.",
  "A detectable malpractice violation may cause the examination to be automatically submitted or terminated.",
];

function RulesPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [block, setBlock] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [minutes, setMinutes] = useState(45);

  useEffect(() => {
    void (async () => {
      const me = await getMe();
      if (me.role !== "participant") {
        await navigate({ to: "/register" });
        return;
      }
      if (me.participant.status === "registered") {
        await navigate({ to: "/confirm" });
        return;
      }
      if (me.participant.status === "in_progress") {
        await navigate({ to: "/exam" });
        return;
      }
      if (me.participant.status === "submitted" || me.participant.status === "terminated") {
        await navigate({ to: "/result" });
        return;
      }
      const comp = await getCompetition();
      setMinutes(comp.timerMinutes);
      setBlock(comp.canStart ? null : comp.startBlockReason);
      setReady(true);
    })();
  }, [navigate]);

  async function start() {
    setPending(true);
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        try {
          await el.requestFullscreen();
        } catch {
          /* Preview iframes and some browsers block fullscreen. Continue. */
        }
      }
      await startExam();
      await navigate({ to: "/exam" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the test.");
    } finally {
      setPending(false);
    }
  }

  if (!ready) {
    return <div className="grid min-h-dvh place-items-center text-muted">Loading…</div>;
  }

  return (
    <main className="relative min-h-dvh">
      <GridBackdrop />
      <div className="relative mx-auto max-w-2xl px-5 py-8">
        <BrandMark />
        <Card className="mt-8 glow-panel">
          <CardHeader>
            <CardTitle>BUG HUNT — important rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3">
              {RULES.map((rule, i) => (
                <li key={rule} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-0.5 font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted">
              Official duration: {minutes} minutes. The timer starts only when you click Start
              test.
            </p>
            {block ? (
              <p className="mt-4 rounded-[var(--radius-sm)] border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-warn">
                {block}
              </p>
            ) : null}
            <Button
              className="mt-6 w-full"
              size="lg"
              disabled={pending || Boolean(block)}
              onClick={() => void start()}
            >
              {pending ? "Starting…" : "START TEST"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
