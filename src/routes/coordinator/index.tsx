import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { BrandMark, GridBackdrop } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { coordinatorLogin, getMe } from "@/lib/bughunt/fns";
import { friendlyRpcError } from "@/lib/utils";

export const Route = createFileRoute("/coordinator/")({ component: CoordinatorLogin });

function CoordinatorLogin() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void getMe().then((me) => {
      if (me.role === "coordinator") void navigate({ to: "/coordinator/questions" });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await coordinatorLogin({ data: { code } });
      await navigate({ to: "/coordinator/questions" });
    } catch (err) {
      toast.error(friendlyRpcError(err, "Access denied."));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative min-h-dvh">
      <GridBackdrop />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
        <BrandMark />
        <Card className="mt-8 glow-panel">
          <CardHeader>
            <CardTitle>Coordinator access</CardTitle>
            <CardDescription>
              This portal is separate from participant registration. Use only the coordinator
              access code. After sign-in you land on the question bank so you can edit programs
              and hidden answer keys.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="mb-5 list-decimal space-y-2 pl-5 text-sm text-muted">
              <li>Enter the coordinator code and open the question bank.</li>
              <li>Add or edit six questions: exactly 3 Python and 3 C. Paste the buggy code and the correct answer key, then set marks per error.</li>
              <li>Assign slots Q1–Q6, then open the competition in Settings.</li>
              <li>Watch Results for ranking, malpractice, and winner audit.</li>
            </ol>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <label className="grid gap-2">
                <Label>Access code</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoComplete="off"
                  className="font-mono"
                  required
                />
              </label>
              <Button type="submit" disabled={pending}>
                {pending ? "Checking…" : "Open question bank"}
              </Button>
            </form>
            <Link to="/" className="mt-4 inline-block text-xs text-muted hover:text-fg">
              Back to landing
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
