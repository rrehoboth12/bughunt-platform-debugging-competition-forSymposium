import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Code2, Shield, Trophy } from "lucide-react";
import { BrandMark, GridBackdrop } from "@/components/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <GridBackdrop />
      <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <BrandMark />
          <Link
            to="/coordinator"
            className="text-xs uppercase tracking-[0.16em] text-muted hover:text-fg"
          >
            Coordinator
          </Link>
        </header>

        <section className="flex flex-1 flex-col justify-center py-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Arunachala College of Engineering for Women
          </p>
          <p className="mt-2 text-sm text-muted">Artificial Intelligence and Data Science</p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
            MIRAI
          </h1>
          <div className="mt-6 inline-flex w-fit items-center gap-3 rounded-[var(--radius-md)] border border-primary/30 bg-primary/10 px-4 py-2">
            <span className="font-display text-xl font-semibold text-primary sm:text-2xl">
              BUG HUNT
            </span>
            <span className="hidden h-4 w-px bg-primary/40 sm:block" />
            <span className="hidden font-mono text-xs text-primary sm:inline">
              3 Python · 3 C · 45:00
            </span>
          </div>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Find the Bug. Fix the Code. Beat the Clock.
          </p>
          <p className="mt-3 max-w-xl text-sm text-subtle">
            A live debugging competition. Six programs. Positive marking for every error you
            correct. Ranked by score, then time.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated/80 p-5 glow-panel">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Participants</p>
              <h2 className="mt-2 font-display text-xl font-semibold">Enter BUG HUNT</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
                <li>Register with a participant access code</li>
                <li>Confirm your details</li>
                <li>Read the rules, then start the 45:00 test</li>
              </ol>
              <Button asChild size="lg" className="mt-5">
                <Link to="/register">
                  Enter competition
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated/80 p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Coordinators</p>
              <h2 className="mt-2 font-display text-xl font-semibold">Set questions & answers</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
                <li>Open coordinator access and enter the coordinator code</li>
                <li>Question bank — edit programs, answer keys, and marks</li>
                <li>Select exactly 3 Python + 3 C, then open the competition</li>
              </ol>
              <Button asChild variant="outline" size="lg" className="mt-5">
                <Link to="/coordinator">Coordinator access</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-3 pb-8 sm:grid-cols-4">
          {[
            { icon: Code2, label: "Six programs", detail: "3 Python, 3 C" },
            { icon: Clock, label: "One timer", detail: "Starts on START TEST" },
            { icon: Shield, label: "No negative marks", detail: "Fixes only add score" },
            { icon: Trophy, label: "Live ranking", detail: "Score, then time" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated/80 p-4"
            >
              <item.icon className="size-4 text-primary" />
              <div className="mt-3 text-sm font-medium">{item.label}</div>
              <div className="text-xs text-muted">{item.detail}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
