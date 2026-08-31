import type { ExecutionResult, Language, TestCase, TestRunResult } from "./types";
import { normalizeStdout } from "./scoring";

type PistonResponse = {
  language?: string;
  compile?: { stdout?: string; stderr?: string; code?: number; output?: string };
  run?: { stdout?: string; stderr?: string; code?: number; output?: string; signal?: string };
  message?: string;
};

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

async function pistonRun(
  language: Language,
  code: string,
  stdin: string,
): Promise<{
  compileOk: boolean | null;
  compileOutput: string;
  stdout: string;
  stderr: string;
  error: string | null;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 14000);
  try {
    const res = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language === "python" ? "python" : "c",
        version: language === "python" ? "3.10.0" : "10.2.0",
        files: [
          {
            name: language === "python" ? "main.py" : "main.c",
            content: code,
          },
        ],
        stdin: stdin ?? "",
        compile_timeout: 8000,
        run_timeout: 4000,
        compile_memory_limit: 128000,
        run_memory_limit: 64000,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        compileOk: null,
        compileOutput: "",
        stdout: "",
        stderr: "",
        error: `Sandbox HTTP ${res.status}${text ? `: ${text.slice(0, 180)}` : ""}`,
      };
    }
    const data = (await res.json()) as PistonResponse;
    const compileOutput = [data.compile?.stderr, data.compile?.stdout]
      .filter(Boolean)
      .join("\n")
      .trim();
    const compileOk =
      language === "c"
        ? data.compile
          ? (data.compile.code ?? 0) === 0
          : true
        : null;
    const stdout = data.run?.stdout ?? "";
    const stderr = data.run?.stderr ?? data.message ?? "";
    return {
      compileOk,
      compileOutput,
      stdout,
      stderr,
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Execution timed out in the sandbox."
        : err instanceof Error
          ? err.message
          : "Sandbox unavailable.";
    return {
      compileOk: null,
      compileOutput: "",
      stdout: "",
      stderr: "",
      error: message,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function executeAgainstTests(
  language: Language,
  code: string,
  tests: TestCase[],
  includeHidden: boolean,
): Promise<ExecutionResult> {
  const selected = tests.filter((t) => includeHidden || t.visibility === "visible");
  if (selected.length === 0) {
    const run = await pistonRun(language, code, "");
    return {
      ok: !run.error && (run.compileOk ?? true) && !run.stderr,
      compileOk: run.compileOk,
      compileOutput: run.compileOutput,
      runtimeOutput: run.stdout || run.stderr,
      error: run.error,
      tests: [],
    };
  }

  const results: TestRunResult[] = [];
  let compileOk: boolean | null = null;
  let compileOutput = "";
  let runtimeOutput = "";
  let error: string | null = null;

  for (const test of selected) {
    const run = await pistonRun(language, code, test.stdin);
    if (run.compileOk !== null) compileOk = run.compileOk;
    if (run.compileOutput) compileOutput = run.compileOutput;
    if (run.error) error = run.error;
    const actual = run.stdout;
    runtimeOutput = actual || run.stderr;
    const passed =
      !run.error &&
      (run.compileOk ?? true) &&
      normalizeStdout(actual) === normalizeStdout(test.expectedStdout);
    results.push({
      id: test.id,
      visibility: test.visibility,
      passed,
      expected: test.visibility === "hidden" && !includeHidden ? "" : test.expectedStdout,
      actual: test.visibility === "hidden" && !includeHidden ? "" : actual,
      stderr: run.stderr,
    });
  }

  return {
    ok: !error && results.every((t) => t.passed),
    compileOk,
    compileOutput,
    runtimeOutput,
    error,
    tests: results,
  };
}
