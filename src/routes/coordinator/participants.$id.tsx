import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuditView } from "@/components/audit-view";
import { CoordShell } from "@/components/coord-shell";
import { getParticipantReview } from "@/lib/bughunt/fns";
import type { ParticipantReview } from "@/lib/bughunt/types";

export const Route = createFileRoute("/coordinator/participants/$id")({
  component: ReviewPage,
});

function ReviewPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<ParticipantReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getParticipantReview({ data: { id } })
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Could not load review."),
      );
  }, [id]);

  if (error) {
    return (
      <CoordShell active="review">
        <p className="text-danger">{error}</p>
      </CoordShell>
    );
  }
  if (!data) {
    return (
      <CoordShell active="review">
        <p className="text-muted">Loading verification record…</p>
      </CoordShell>
    );
  }

  return (
    <CoordShell active="review">
      <Link to="/coordinator/dashboard" className="text-xs text-muted hover:text-fg">
        Back to results
      </Link>
      <div className="mt-4">
        <AuditView data={data} />
      </div>
    </CoordShell>
  );
}
