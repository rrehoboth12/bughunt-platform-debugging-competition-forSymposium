import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandMark, GridBackdrop } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmDetails, getMe } from "@/lib/bughunt/fns";
import type { ParticipantPublic } from "@/lib/bughunt/types";

export const Route = createFileRoute("/confirm")({ component: ConfirmPage });

function ConfirmPage() {
  const navigate = useNavigate();
  const [participant, setParticipant] = useState<ParticipantPublic | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void getMe().then((me) => {
      if (me.role !== "participant") {
        void navigate({ to: "/register" });
        return;
      }
      if (me.participant.status === "in_progress") {
        void navigate({ to: "/exam" });
        return;
      }
      if (me.participant.status === "submitted" || me.participant.status === "terminated") {
        void navigate({ to: "/result" });
        return;
      }
      if (me.participant.status === "confirmed") {
        void navigate({ to: "/rules" });
        return;
      }
      setParticipant(me.participant);
    });
  }, [navigate]);

  async function confirm() {
    setPending(true);
    try {
      await confirmDetails();
      await navigate({ to: "/rules" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not confirm details.");
    } finally {
      setPending(false);
    }
  }

  if (!participant) {
    return <div className="grid min-h-dvh place-items-center text-muted">Loading…</div>;
  }

  const rows: [string, string][] = [
    ["Full name", participant.fullName],
    ["Department", participant.department],
    ["Year", participant.year],
    ["Email ID", participant.email],
    ["Phone number", participant.phone],
    ["College name", participant.college],
  ];

  return (
    <main className="relative min-h-dvh">
      <GridBackdrop />
      <div className="relative mx-auto max-w-xl px-5 py-8">
        <BrandMark />
        <Card className="mt-8 glow-panel">
          <CardHeader>
            <CardTitle>Verify your details</CardTitle>
            <CardDescription>
              Please verify your details before starting BUG HUNT.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border rounded-[var(--radius-md)] border border-border">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 px-4 py-3 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/register">EDIT DETAILS</Link>
              </Button>
              <Button className="mt-0 flex-1" onClick={() => void confirm()} disabled={pending}>
                {pending ? "Saving…" : "CONFIRM DETAILS"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
