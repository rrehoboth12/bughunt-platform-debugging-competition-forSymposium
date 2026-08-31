import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CoordShell } from "@/components/coord-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompetition, updateSettings } from "@/lib/bughunt/fns";
import type { CompetitionPublic, CompetitionStatus, MalpracticePolicy } from "@/lib/bughunt/types";

export const Route = createFileRoute("/coordinator/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [comp, setComp] = useState<CompetitionPublic | null>(null);
  const [timerMinutes, setTimerMinutes] = useState(45);
  const [policy, setPolicy] = useState<MalpracticePolicy>("terminate_after");
  const [limit, setLimit] = useState(3);
  const [status, setStatus] = useState<CompetitionStatus>("open");
  const [locked, setLocked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void getCompetition().then((c) => {
      setComp(c);
      setTimerMinutes(c.timerMinutes);
      setPolicy(c.malpracticePolicy);
      setLimit(c.malpracticeLimit);
      setStatus(c.status);
      setLocked(c.questionsLocked);
    });
  }, []);

  async function save() {
    setPending(true);
    try {
      const next = await updateSettings({
        data: {
          timerMinutes,
          malpracticePolicy: policy,
          malpracticeLimit: limit,
          status,
          questionsLocked: locked,
        },
      });
      setComp(next);
      toast.success("Settings saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setPending(false);
    }
  }

  return (
    <CoordShell active="settings">
      <h1 className="font-display text-2xl font-semibold">Competition settings</h1>
      <p className="mt-1 text-sm text-muted">
        Opening the competition requires exactly six selected questions: 3 Python and 3 C.
        {comp ? ` Current mix: ${comp.pythonCount} Python + ${comp.cCount} C.` : null}
      </p>

      <div className="mt-6 grid max-w-xl gap-4">
        <label className="grid gap-2">
          <Label>Timer (minutes)</Label>
          <Input
            type="number"
            min={1}
            max={180}
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(Number(e.target.value))}
          />
        </label>
        <label className="grid gap-2">
          <Label>Competition status</Label>
          <select
            className="h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as CompetitionStatus)}
          >
            <option value="setup">Setup — participants cannot start</option>
            <option value="open">Open — participants may start</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label className="grid gap-2">
          <Label>Malpractice policy</Label>
          <select
            className="h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
            value={policy}
            onChange={(e) => setPolicy(e.target.value as MalpracticePolicy)}
          >
            <option value="log_only">Log only</option>
            <option value="terminate_after">Terminate after N events</option>
            <option value="immediate">Terminate on first event</option>
          </select>
        </label>
        <label className="grid gap-2">
          <Label>Malpractice limit (N)</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={locked}
            onChange={(e) => setLocked(e.target.checked)}
          />
          Lock question bank after start
        </label>
        <Button onClick={() => void save()} disabled={pending} className="w-fit">
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </CoordShell>
  );
}
