import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { BrandMark, GridBackdrop } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMe, registerParticipant, updateDetails } from "@/lib/bughunt/fns";

export const Route = createFileRoute("/register")({ component: RegisterPage });

const YEARS = ["I", "II", "III", "IV", "PG"];

function RegisterPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    department: "Artificial Intelligence and Data Science",
    year: "III",
    email: "",
    phone: "",
    college: "Arunachala College of Engineering for Women",
    participationCode: "",
  });

  useEffect(() => {
    void getMe().then((me) => {
      if (me.role === "coordinator") {
        void navigate({ to: "/coordinator/dashboard" });
        return;
      }
      if (me.role !== "participant") return;
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
      setEditing(true);
      setForm((prev) => ({
        ...prev,
        fullName: me.participant.fullName,
        department: me.participant.department,
        year: me.participant.year,
        email: me.participant.email,
        phone: me.participant.phone,
        college: me.participant.college,
      }));
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      if (editing) {
        await updateDetails({
          data: {
            fullName: form.fullName,
            department: form.department,
            year: form.year,
            email: form.email,
            phone: form.phone,
            college: form.college,
          },
        });
        await navigate({ to: "/confirm" });
      } else {
        const result = await registerParticipant({ data: form });
        if (result.kind === "coordinator") {
          await navigate({ to: "/coordinator/dashboard" });
          return;
        }
        await navigate({ to: "/confirm" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setPending(false);
    }
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="relative min-h-dvh">
      <GridBackdrop />
      <div className="relative mx-auto max-w-xl px-5 py-8">
        <div className="mb-8 flex items-center justify-between">
          <BrandMark />
          <Link to="/" className="text-xs text-muted hover:text-fg">
            Back
          </Link>
        </div>
        <Card className="glow-panel">
          <CardHeader>
            <CardTitle>Participant registration</CardTitle>
            <CardDescription>
              Enter your details and the access code issued by the coordinators. Staff access is
              resolved on the server — never enter a staff code into local checks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <Field label="Full name">
                <Input
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  autoComplete="name"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Department">
                  <Input
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                    placeholder="AI & DS"
                  />
                </Field>
                <Field label="Year">
                  <select
                    className="flex h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Email ID">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone number">
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="tel"
                />
              </Field>
              <Field label="College name">
                <Input
                  value={form.college}
                  onChange={(e) => set("college", e.target.value)}
                />
              </Field>
              {editing ? null : (
                <Field label="Access code">
                  <Input
                    required
                    value={form.participationCode}
                    onChange={(e) => set("participationCode", e.target.value)}
                    autoComplete="off"
                    className="font-mono tracking-wide"
                  />
                </Field>
              )}
              <Button type="submit" className="mt-2" disabled={pending}>
                {pending ? "Validating…" : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
