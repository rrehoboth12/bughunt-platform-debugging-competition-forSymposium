import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { getMe, logoutSession } from "@/lib/bughunt/fns";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/coordinator/questions", label: "Question bank", key: "questions" },
  { to: "/coordinator/dashboard", label: "Results", key: "results" },
  { to: "/coordinator/settings", label: "Settings", key: "settings" },
] as const;

export function CoordShell({
  children,
  active,
}: {
  children: ReactNode;
  active: "results" | "questions" | "settings" | "review";
}) {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    void getMe().then((me) => {
      if (me.role !== "coordinator") {
        void navigate({ to: "/coordinator" });
        return;
      }
      setOk(true);
    });
  }, [navigate]);

  if (!ok) {
    return <div className="grid min-h-dvh place-items-center text-muted">Checking access…</div>;
  }

  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur-sm">
        <BrandMark />
        <nav className="flex flex-1 flex-wrap gap-1 sm:ml-6">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-2 text-sm",
                (active === "questions" && l.key === "questions") ||
                  (active === "results" && l.key === "results") ||
                  (active === "review" && l.key === "results") ||
                  (active === "settings" && l.key === "settings")
                  ? "bg-bg-subtle text-fg"
                  : "text-muted hover:text-fg",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            void logoutSession().then(() => navigate({ to: "/coordinator" }))
          }
        >
          Sign out
        </Button>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
