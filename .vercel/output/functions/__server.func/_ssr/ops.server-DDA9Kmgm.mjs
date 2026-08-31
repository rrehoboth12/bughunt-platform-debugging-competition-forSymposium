import { i as getCookie, o as setCookie$1, r as deleteCookie$1 } from "./ssr.mjs";
import { a as normalizeStdout, c as unionFixedIds, i as maxMarksOf, n as evaluateErrors, o as parseRule, r as marksFromFixed, s as rulePasses, t as answerStatus } from "./scoring-CMKFoFoW.mjs";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/ops.server-DDA9Kmgm.js
var _0002_bughunt_default = "create table if not exists competition_settings (\n  id text primary key,\n  timer_minutes integer not null default 45,\n  malpractice_policy text not null default 'terminate_after',\n  malpractice_limit integer not null default 3,\n  status text not null default 'open',\n  questions_locked boolean not null default false,\n  updated_at timestamptz not null default now()\n);\n\ncreate table if not exists questions (\n  id text primary key,\n  title text not null,\n  language text not null,\n  description text not null,\n  buggy_code text not null,\n  correct_code text not null,\n  sort_order integer not null default 0,\n  selected_slot integer,\n  is_active boolean not null default true,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists question_errors (\n  id text primary key,\n  question_id text not null references questions(id) on delete cascade,\n  error_type text not null,\n  description text not null,\n  location text not null default '',\n  expected_correction text not null default '',\n  marks integer not null default 1,\n  validation_rule text not null,\n  sort_order integer not null default 0,\n  is_active boolean not null default true\n);\n\ncreate table if not exists test_cases (\n  id text primary key,\n  question_id text not null references questions(id) on delete cascade,\n  visibility text not null default 'visible',\n  stdin text not null default '',\n  expected_stdout text not null default '',\n  sort_order integer not null default 0\n);\n\ncreate table if not exists participants (\n  id text primary key,\n  full_name text not null,\n  department text not null,\n  year text not null,\n  email text not null,\n  phone text not null,\n  college text not null,\n  access_code_used text not null,\n  status text not null default 'registered',\n  started_at timestamptz,\n  completed_at timestamptz,\n  total_marks integer not null default 0,\n  duration_ms integer,\n  malpractice_count integer not null default 0,\n  current_question integer not null default 1,\n  created_at timestamptz not null default now()\n);\n\ncreate unique index if not exists participants_email_idx on participants (lower(email));\n\ncreate table if not exists sessions (\n  id text primary key,\n  token_hash text not null unique,\n  role text not null,\n  participant_id text references participants(id) on delete cascade,\n  expires_at timestamptz not null,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists sessions_token_hash_idx on sessions (token_hash);\n\ncreate table if not exists exam_answers (\n  participant_id text not null references participants(id) on delete cascade,\n  question_id text not null references questions(id) on delete cascade,\n  current_code text not null,\n  best_marks integer not null default 0,\n  best_fixed text not null default '[]',\n  status text not null default 'not_attempted',\n  last_submitted_at timestamptz,\n  last_compile text,\n  last_runtime text,\n  last_tests text,\n  primary key (participant_id, question_id)\n);\n\ncreate table if not exists submissions (\n  id text primary key,\n  participant_id text not null references participants(id) on delete cascade,\n  question_id text not null references questions(id) on delete cascade,\n  submitted_code text not null,\n  submitted_at timestamptz not null default now(),\n  fixed_errors text not null default '[]',\n  unfixed_errors text not null default '[]',\n  marks_awarded integer not null default 0,\n  compile_ok boolean,\n  compile_output text,\n  runtime_output text,\n  test_results text not null default '[]'\n);\n\ncreate index if not exists submissions_participant_idx on submissions (participant_id, question_id, submitted_at desc);\n\ncreate table if not exists malpractice_logs (\n  id text primary key,\n  participant_id text not null references participants(id) on delete cascade,\n  violation_type text not null,\n  occurred_at timestamptz not null default now(),\n  question_slot integer,\n  violation_count integer not null\n);\n\ncreate index if not exists malpractice_participant_idx on malpractice_logs (participant_id, occurred_at desc);\n\n-- Spec mapping: profiles ≈ participants (id, full_name, department, year, email, phone,\n-- college, access_code_used, started_at, completed_at, total_marks, duration_ms, status,\n-- malpractice_count). Question error rules live in question_errors (errors_json equivalent).\ncreate or replace view profiles as\nselect\n  id,\n  full_name,\n  department,\n  year,\n  email,\n  phone,\n  college,\n  access_code_used as access_code,\n  started_at as start_time,\n  completed_at as end_time,\n  total_marks::float as total_score,\n  case when duration_ms is null then null else (duration_ms / 1000)::int end as elapsed_seconds,\n  upper(status) as status,\n  malpractice_count as violation_count\nfrom participants;\n\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_bughunt.sql": _0002_bughunt_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var PISTON_URL = "https://emkc.org/api/v2/piston/execute";
async function pistonRun(language, code, stdin) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 14e3);
	try {
		const res = await fetch(PISTON_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				language: language === "python" ? "python" : "c",
				version: language === "python" ? "3.10.0" : "10.2.0",
				files: [{
					name: language === "python" ? "main.py" : "main.c",
					content: code
				}],
				stdin: stdin ?? "",
				compile_timeout: 8e3,
				run_timeout: 4e3,
				compile_memory_limit: 128e3,
				run_memory_limit: 64e3
			}),
			signal: controller.signal
		});
		if (!res.ok) {
			const text = await res.text().catch(() => "");
			return {
				compileOk: null,
				compileOutput: "",
				stdout: "",
				stderr: "",
				error: `Sandbox HTTP ${res.status}${text ? `: ${text.slice(0, 180)}` : ""}`
			};
		}
		const data = await res.json();
		const compileOutput = [data.compile?.stderr, data.compile?.stdout].filter(Boolean).join("\n").trim();
		return {
			compileOk: language === "c" ? data.compile ? (data.compile.code ?? 0) === 0 : true : null,
			compileOutput,
			stdout: data.run?.stdout ?? "",
			stderr: data.run?.stderr ?? data.message ?? "",
			error: null
		};
	} catch (err) {
		return {
			compileOk: null,
			compileOutput: "",
			stdout: "",
			stderr: "",
			error: err instanceof Error && err.name === "AbortError" ? "Execution timed out in the sandbox." : err instanceof Error ? err.message : "Sandbox unavailable."
		};
	} finally {
		clearTimeout(timer);
	}
}
async function executeAgainstTests(language, code, tests, includeHidden) {
	const selected = tests.filter((t) => includeHidden || t.visibility === "visible");
	if (selected.length === 0) {
		const run = await pistonRun(language, code, "");
		return {
			ok: !run.error && (run.compileOk ?? true) && !run.stderr,
			compileOk: run.compileOk,
			compileOutput: run.compileOutput,
			runtimeOutput: run.stdout || run.stderr,
			error: run.error,
			tests: []
		};
	}
	const results = [];
	let compileOk = null;
	let compileOutput = "";
	let runtimeOutput = "";
	let error = null;
	for (const test of selected) {
		const run = await pistonRun(language, code, test.stdin);
		if (run.compileOk !== null) compileOk = run.compileOk;
		if (run.compileOutput) compileOutput = run.compileOutput;
		if (run.error) error = run.error;
		const actual = run.stdout;
		runtimeOutput = actual || run.stderr;
		const passed = !run.error && (run.compileOk ?? true) && normalizeStdout(actual) === normalizeStdout(test.expectedStdout);
		results.push({
			id: test.id,
			visibility: test.visibility,
			passed,
			expected: test.visibility === "hidden" && !includeHidden ? "" : test.expectedStdout,
			actual: test.visibility === "hidden" && !includeHidden ? "" : actual,
			stderr: run.stderr
		});
	}
	return {
		ok: !error && results.every((t) => t.passed),
		compileOk,
		compileOutput,
		runtimeOutput,
		error,
		tests: results
	};
}
var BANK = [
	{
		id: "q-stack",
		title: "Debug the Stack Implementation",
		language: "python",
		slot: 1,
		description: "## Objective\nDebug this Python **Stack** so `push`, `pop`, and `peek` work from a main block.\n\n### Restore\n- Class structure and constructor\n- List operations (`append`, top index `-1`)\n- Main guard and object construction\n\nThe intended demo pushes `10` then `30`, prints the top, then pops.",
		buggyCode: `Class Stack:
       def _init_(self):
            self.items = []
def push(item):
    self.items.add(item)
    print("Pushed {item} onto stack")
def pop(self):
     if not is_empty():
        return None 
    return self.items.pop()
def peek(self):
   	    return self.items[0]
   if name == main:
stack.push(10)
stack.push(30)
print("Top element:", stack.peek)
print("Popped element:", stack.pop())
`,
		correctCode: `class Stack:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def push(self, item):
        self.items.append(item)
        print(f"Pushed {item} onto stack")

    def pop(self):
        if self.is_empty():
            return None
        return self.items.pop()

    def peek(self):
        return self.items[-1]

if __name__ == "__main__":
    stack = Stack()
    stack.push(10)
    stack.push(30)
    print("Top element:", stack.peek())
    print("Popped element:", stack.pop())
`,
		errors: [
			{
				id: "q-stack-e01",
				errorType: "syntax",
				description: "'Class' should be lowercase 'class'.",
				location: "line 1",
				expectedCorrection: "class Stack:",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "\\bclass\\s+Stack\\b"
				}
			},
			{
				id: "q-stack-e02",
				errorType: "syntax",
				description: "'_init_' should be '__init__'.",
				location: "constructor",
				expectedCorrection: "def __init__(self):",
				marks: 2,
				validationRule: {
					type: "contains",
					value: "__init__"
				}
			},
			{
				id: "q-stack-e03",
				errorType: "syntax",
				description: "push() is missing the self parameter.",
				location: "push",
				expectedCorrection: "def push(self, item):",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "def\\s+push\\(\\s*self\\s*,"
				}
			},
			{
				id: "q-stack-e04",
				errorType: "logic",
				description: "Lists use append(), not add().",
				location: "push body",
				expectedCorrection: "self.items.append(item)",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "self\\.items\\.append\\s*\\("
				}
			},
			{
				id: "q-stack-e05",
				errorType: "syntax",
				description: "The print statement requires an f-string to display the item value.",
				location: "push print",
				expectedCorrection: "print(f\"Pushed {item} onto stack\")",
				marks: 1,
				validationRule: {
					type: "any",
					rules: [
						{
							type: "regex",
							pattern: "print\\(\\s*f['\\\"]Pushed"
						},
						{
							type: "regex",
							pattern: "print\\(.*\\.format\\("
						},
						{
							type: "regex",
							pattern: "print\\(.*%\\s*item"
						},
						{
							type: "regex",
							pattern: "print\\([^)]*\\+\\s*str\\(item\\)"
						}
					]
				}
			},
			{
				id: "q-stack-e06",
				errorType: "logic",
				description: "pop() should call self.is_empty() according to the intended class design.",
				location: "pop",
				expectedCorrection: "if self.is_empty():",
				marks: 2,
				validationRule: {
					type: "contains",
					value: "self.is_empty()"
				}
			},
			{
				id: "q-stack-e07",
				errorType: "logic",
				description: "peek() should use [-1] for the top element.",
				location: "peek",
				expectedCorrection: "return self.items[-1]",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "self\\.items\\s*\\[\\s*-1\\s*\\]"
				}
			},
			{
				id: "q-stack-e08",
				errorType: "syntax",
				description: "'__name__ == \"__main__\"' should be used.",
				location: "main guard",
				expectedCorrection: "if __name__ == \"__main__\":",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "__name__\\s*==\\s*['\\\"]__main__['\\\"]"
				}
			},
			{
				id: "q-stack-e09",
				errorType: "logic",
				description: "A Stack object must be created, e.g. stack = Stack().",
				location: "main",
				expectedCorrection: "stack = Stack()",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "stack\\s*=\\s*Stack\\s*\\("
				}
			},
			{
				id: "q-stack-e10",
				errorType: "syntax",
				description: "stack.peek() requires parentheses.",
				location: "main print",
				expectedCorrection: "stack.peek()",
				marks: 1,
				validationRule: {
					type: "regex",
					pattern: "stack\\.peek\\s*\\("
				}
			}
		],
		tests: [{
			id: "q-stack-t1",
			visibility: "visible",
			stdin: "",
			expectedStdout: "Pushed 10 onto stack\nPushed 30 onto stack\nTop element: 30\nPopped element: 30"
		}]
	},
	{
		id: "q-average",
		title: "Debug the Array Average Program",
		language: "c",
		slot: 2,
		description: "## Objective\nThis C program should compute the **average** of six integers and count how many values are strictly greater than that average.\n\n### Watch for\n- Missing semicolons\n- Off-by-one loops\n- Integer division\n- `count++` vs `count--`\n\nPrint the average to two decimal places, then the count.",
		buggyCode: `#include <stdio.h>

int main() {
    int a[6] = {12, 25, 18, 30, 15, 20}
    int sum = 0, count = 0;
    int avg;
    int i;

    for(i = 0; i <= 6; i++)
        sum = a[i];

    avg = sum / 5;

    for(i = 0; i < 6; i++) {
        if(a[i] > avg);
            count--;
    }

    printf("Average = %.2f\\n", avg);
    printf("Count = %d\\n", count)

    return 1;
}
`,
		correctCode: `#include <stdio.h>

int main() {
    int a[6] = {12, 25, 18, 30, 15, 20};
    int sum = 0, count = 0;
    float avg;
    int i;

    for(i = 0; i < 6; i++)
        sum += a[i];

    avg = sum / 6.0;

    for(i = 0; i < 6; i++) {
        if(a[i] > avg)
            count++;
    }

    printf("Average = %.2f\\n", avg);
    printf("Count = %d\\n", count);

    return 0;
}
`,
		errors: [
			{
				id: "q-average-e01",
				errorType: "syntax",
				description: "Missing semicolon after the array declaration.",
				location: "array declaration",
				expectedCorrection: "int a[6] = {12, 25, 18, 30, 15, 20};",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "int\\s+a\\s*\\[\\s*6\\s*\\]\\s*=\\s*\\{[^}]+\\}\\s*;"
				}
			},
			{
				id: "q-average-e02",
				errorType: "logic",
				description: "avg should be float to hold the average.",
				location: "avg declaration",
				expectedCorrection: "float avg;",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "(float|double)\\s+avg\\b"
				}
			},
			{
				id: "q-average-e03",
				errorType: "logic",
				description: "i <= 6 should be i < 6 to avoid going outside the array.",
				location: "first loop",
				expectedCorrection: "for(i = 0; i < 6; i++)",
				marks: 2,
				validationRule: {
					type: "not_contains",
					value: "i <= 6"
				}
			},
			{
				id: "q-average-e04",
				errorType: "logic",
				description: "sum = a[i] should be sum += a[i].",
				location: "summation",
				expectedCorrection: "sum += a[i];",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "sum\\s*\\+=\\s*a\\s*\\["
				}
			},
			{
				id: "q-average-e05",
				errorType: "logic",
				description: "Average divisor should be 6, not 5.",
				location: "average",
				expectedCorrection: "avg = sum / 6.0;",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "sum\\s*/\\s*6"
				}
			},
			{
				id: "q-average-e06",
				errorType: "logic",
				description: "Integer division must be avoided when calculating the average.",
				location: "average",
				expectedCorrection: "sum / 6.0 or (float)sum / 6",
				marks: 2,
				validationRule: {
					type: "any",
					rules: [
						{
							type: "regex",
							pattern: "sum\\s*/\\s*6\\.0"
						},
						{
							type: "regex",
							pattern: "\\(float\\)\\s*sum"
						},
						{
							type: "regex",
							pattern: "\\(double\\)\\s*sum"
						},
						{
							type: "regex",
							pattern: "sum\\s*/\\s*6\\.0f"
						}
					]
				}
			},
			{
				id: "q-average-e07",
				errorType: "syntax",
				description: "Stray semicolon after if(a[i] > avg) must be removed.",
				location: "count loop",
				expectedCorrection: "if(a[i] > avg)",
				marks: 2,
				validationRule: {
					type: "all",
					rules: [{
						type: "not_contains",
						value: "if(a[i] > avg);"
					}, {
						type: "not_contains",
						value: "if (a[i] > avg);"
					}]
				}
			},
			{
				id: "q-average-e08",
				errorType: "logic",
				description: "count-- should be count++.",
				location: "count loop",
				expectedCorrection: "count++;",
				marks: 2,
				validationRule: {
					type: "contains",
					value: "count++"
				}
			},
			{
				id: "q-average-e09",
				errorType: "logic",
				description: "%.2f requires a floating-point value for avg.",
				location: "printf average",
				expectedCorrection: "float avg used with %.2f",
				marks: 1,
				validationRule: {
					type: "regex",
					pattern: "(float|double)\\s+avg\\b"
				}
			},
			{
				id: "q-average-e10",
				errorType: "syntax",
				description: "Missing semicolon after printf Count.",
				location: "second printf",
				expectedCorrection: "printf(\"Count = %d\\n\", count);",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "printf\\(\\s*\"Count = %d\\\\n\"\\s*,\\s*count\\s*\\)\\s*;"
				}
			},
			{
				id: "q-average-e11",
				errorType: "logic",
				description: "return 1 is conventionally return 0 for successful execution (optional).",
				location: "return",
				expectedCorrection: "return 0;",
				marks: 1,
				validationRule: {
					type: "regex",
					pattern: "return\\s+0\\s*;"
				}
			}
		],
		tests: [{
			id: "q-average-t1",
			visibility: "visible",
			stdin: "",
			expectedStdout: "Average = 20.00\nCount = 2"
		}]
	},
	{
		id: "q-fibonacci",
		title: "Debug the Fibonacci and Array Program",
		language: "c",
		slot: 3,
		description: "## Objective\nDouble each array element, print the updated array with a pointer, compute `Fib(6)`, and print the sum.\n\n### Watch for\n- Assignment vs comparison (`=` / `==`)\n- Missing semicolons\n- Uninitialized `total`\n- Pointer arithmetic `*(ptr + i)`",
		buggyCode: `#include <stdio.h>

int fib(int n) {
    if (n = 0)
        return 0
    if (n == 1)
        return 1;
    return fib(n - 1) + fib(n - 2)
}

void updateArray(int arr[], int n) {
    for (int i = 0; i <= n; i++)
        arr[i] = arr[i] * 2;
}

int main() {
    int nums[5] = {1, 2, 3, 4, 5}
    int *ptr = nums;

    updateArray(nums, 5);

    for (int i = 0; i < 5; i++)
        printf("%d ", *ptr + i)

    int result = fib(6)
    printf("\\nFib(6) = %d", result);

    int total;
    for (int i = 0; i < 5; i--)
        total += nums[i];
    printf("\\nTotal = %d", total)
}
`,
		correctCode: `#include <stdio.h>

int fib(int n) {
    if (n == 0)
        return 0;
    if (n == 1)
        return 1;
    return fib(n - 1) + fib(n - 2);
}

void updateArray(int arr[], int n) {
    for (int i = 0; i < n; i++)
        arr[i] = arr[i] * 2;
}

int main() {
    int nums[5] = {1, 2, 3, 4, 5};
    int *ptr = nums;

    updateArray(nums, 5);

    for (int i = 0; i < 5; i++)
        printf("%d ", *(ptr + i));

    int result = fib(6);
    printf("\\nFib(6) = %d", result);

    int total = 0;
    for (int i = 0; i < 5; i++)
        total += nums[i];
    printf("\\nTotal = %d", total);
    return 0;
}
`,
		errors: [
			{
				id: "q-fib-e01",
				errorType: "logic",
				description: "n = 0 should be n == 0.",
				location: "fib base case",
				expectedCorrection: "if (n == 0)",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "if\\s*\\(\\s*n\\s*==\\s*0\\s*\\)"
				}
			},
			{
				id: "q-fib-e02",
				errorType: "syntax",
				description: "Missing semicolon after return 0.",
				location: "fib",
				expectedCorrection: "return 0;",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "return\\s+0\\s*;"
				}
			},
			{
				id: "q-fib-e03",
				errorType: "syntax",
				description: "Missing semicolon after the recursive return.",
				location: "fib",
				expectedCorrection: "return fib(n - 1) + fib(n - 2);",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "return\\s+fib\\s*\\(\\s*n\\s*-\\s*1\\s*\\)\\s*\\+\\s*fib\\s*\\(\\s*n\\s*-\\s*2\\s*\\)\\s*;"
				}
			},
			{
				id: "q-fib-e04",
				errorType: "logic",
				description: "i <= n should be i < n.",
				location: "updateArray",
				expectedCorrection: "for (int i = 0; i < n; i++)",
				marks: 2,
				validationRule: {
					type: "not_contains",
					value: "i <= n"
				}
			},
			{
				id: "q-fib-e05",
				errorType: "syntax",
				description: "Missing semicolon after nums array declaration.",
				location: "main",
				expectedCorrection: "int nums[5] = {1, 2, 3, 4, 5};",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "int\\s+nums\\s*\\[\\s*5\\s*\\]\\s*=\\s*\\{[^}]+\\}\\s*;"
				}
			},
			{
				id: "q-fib-e06",
				errorType: "logic",
				description: "*ptr + i is incorrect; use pointer/array indexing.",
				location: "print loop",
				expectedCorrection: "*(ptr + i) or ptr[i]",
				marks: 2,
				validationRule: {
					type: "any",
					rules: [{
						type: "regex",
						pattern: "\\*\\s*\\(\\s*ptr\\s*\\+\\s*i\\s*\\)"
					}, {
						type: "regex",
						pattern: "ptr\\s*\\[\\s*i\\s*\\]"
					}]
				}
			},
			{
				id: "q-fib-e07",
				errorType: "syntax",
				description: "Missing semicolon after printf inside the loop.",
				location: "print loop",
				expectedCorrection: "printf(\"%d \", *(ptr + i));",
				marks: 1,
				validationRule: {
					type: "regex",
					pattern: "printf\\(\\s*\"%d \"\\s*,.*\\)\\s*;"
				}
			},
			{
				id: "q-fib-e08",
				errorType: "syntax",
				description: "Missing semicolon after int result = fib(6).",
				location: "main",
				expectedCorrection: "int result = fib(6);",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "int\\s+result\\s*=\\s*fib\\s*\\(\\s*6\\s*\\)\\s*;"
				}
			},
			{
				id: "q-fib-e09",
				errorType: "logic",
				description: "total is uninitialized.",
				location: "total",
				expectedCorrection: "int total = 0;",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "int\\s+total\\s*=\\s*0\\s*;"
				}
			},
			{
				id: "q-fib-e10",
				errorType: "logic",
				description: "i-- should be i++.",
				location: "sum loop",
				expectedCorrection: "for (int i = 0; i < 5; i++)",
				marks: 2,
				validationRule: {
					type: "all",
					rules: [{
						type: "not_contains",
						value: "i--"
					}, {
						type: "contains",
						value: "i++"
					}]
				}
			},
			{
				id: "q-fib-e11",
				errorType: "syntax",
				description: "Missing semicolon after final printf.",
				location: "final printf",
				expectedCorrection: "printf(\"\\nTotal = %d\", total);",
				marks: 1,
				validationRule: {
					type: "regex",
					pattern: "printf\\(\\s*\"\\\\nTotal = %d\"\\s*,\\s*total\\s*\\)\\s*;"
				}
			}
		],
		tests: [{
			id: "q-fib-t1",
			visibility: "visible",
			stdin: "",
			expectedStdout: "2 4 6 8 10 \nFib(6) = 8\nTotal = 30"
		}]
	},
	{
		id: "q-wordcount",
		title: "Debug the Word Frequency Program",
		language: "python",
		slot: 4,
		description: "## Objective\nCount word frequencies (case-insensitive) and print the **most common** word.\n\n### Watch for\n- Missing colons\n- `=` vs `==` on dictionary writes\n- Main guard comparison",
		buggyCode: `def word_count(text):
    words = text.split(" ")
    counts = {}
    for word in words:
        word = word.lower()
        if word in counts
            counts[word] = counts[word] + 1
        else:
            counts[word] == 1
    return counts

def most_common(counts):
    max_word = None
    max_count = 0
    for word, count in counts.items()
        if count > max_count:
            max_word == word
            max_count = count
    return max_word

if __name__ = "__main__":
    text = "Bug Hunt bug hunt BUG"
    result = word_count(text)
    print(most_common(result))
`,
		correctCode: `def word_count(text):
    words = text.split(" ")
    counts = {}
    for word in words:
        word = word.lower()
        if word in counts:
            counts[word] = counts[word] + 1
        else:
            counts[word] = 1
    return counts

def most_common(counts):
    max_word = None
    max_count = 0
    for word, count in counts.items():
        if count > max_count:
            max_word = word
            max_count = count
    return max_word

if __name__ == "__main__":
    text = "Bug Hunt bug hunt BUG"
    result = word_count(text)
    print(most_common(result))
`,
		errors: [
			{
				id: "q-word-e01",
				errorType: "syntax",
				description: "Missing colon after if word in counts.",
				location: "word_count",
				expectedCorrection: "if word in counts:",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "if\\s+word\\s+in\\s+counts\\s*:"
				}
			},
			{
				id: "q-word-e02",
				errorType: "logic",
				description: "counts[word] == 1 should assign, not compare.",
				location: "else branch",
				expectedCorrection: "counts[word] = 1",
				marks: 2,
				validationRule: {
					type: "all",
					rules: [{
						type: "regex",
						pattern: "counts\\s*\\[\\s*word\\s*\\]\\s*=\\s*1"
					}, {
						type: "not_contains",
						value: "counts[word] == 1"
					}]
				}
			},
			{
				id: "q-word-e03",
				errorType: "syntax",
				description: "Missing colon after for word, count in counts.items().",
				location: "most_common",
				expectedCorrection: "for word, count in counts.items():",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "for\\s+word\\s*,\\s*count\\s+in\\s+counts\\.items\\(\\s*\\)\\s*:"
				}
			},
			{
				id: "q-word-e04",
				errorType: "logic",
				description: "max_word == word should assign, not compare.",
				location: "most_common",
				expectedCorrection: "max_word = word",
				marks: 2,
				validationRule: {
					type: "all",
					rules: [{
						type: "regex",
						pattern: "max_word\\s*=\\s*word"
					}, {
						type: "not_contains",
						value: "max_word == word"
					}]
				}
			},
			{
				id: "q-word-e05",
				errorType: "syntax",
				description: "__name__ = \"__main__\" should use ==.",
				location: "main guard",
				expectedCorrection: "if __name__ == \"__main__\":",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "__name__\\s*==\\s*['\\\"]__main__['\\\"]"
				}
			}
		],
		tests: [{
			id: "q-word-t1",
			visibility: "visible",
			stdin: "",
			expectedStdout: "bug"
		}]
	},
	{
		id: "q-numbers",
		title: "Debug the Factorial, Prime, and Reverse Program",
		language: "python",
		slot: 5,
		description: "## Objective\nCompute `factorial(5)`, test whether `7` is prime, and reverse a list.\n\n### Watch for\n- `if n = 0` should compare\n- Prime-check return values are inverted\n- Reverse currently copies instead of reversing",
		buggyCode: `def factorial(n):
    if n = 0:
        return 1
    return n * factorial(n - 1)

def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):
        if n % i == 0:
            return True
    return False

def reverse_list(items):
    result = []
    for i in range(len(items)):
        result.append(items[i])
    return result

print("Fact(5) =", factorial(5))
print("Is 7 prime?", is_prime(7))
print("Reversed:", reverse_list([1, 2, 3, 4]))
`,
		correctCode: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

def reverse_list(items):
    result = []
    for i in range(len(items) - 1, -1, -1):
        result.append(items[i])
    return result

print("Fact(5) =", factorial(5))
print("Is 7 prime?", is_prime(7))
print("Reversed:", reverse_list([1, 2, 3, 4]))
`,
		errors: [
			{
				id: "q-num-e01",
				errorType: "syntax",
				description: "if n = 0 should be if n == 0.",
				location: "factorial",
				expectedCorrection: "if n == 0:",
				marks: 3,
				validationRule: {
					type: "regex",
					pattern: "if\\s+n\\s*==\\s*0\\s*:"
				}
			},
			{
				id: "q-num-e02",
				errorType: "logic",
				description: "A found divisor means the number is not prime; return False.",
				location: "is_prime loop",
				expectedCorrection: "return False",
				marks: 3,
				validationRule: {
					type: "regex",
					pattern: "if\\s+n\\s*%\\s*i\\s*==\\s*0\\s*:\\s*\\n\\s*return\\s+False"
				}
			},
			{
				id: "q-num-e03",
				errorType: "logic",
				description: "If no divisor is found, is_prime should return True.",
				location: "is_prime end",
				expectedCorrection: "return True",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "return\\s+True\\s*\\n\\s*\\n\\s*def\\s+reverse_list"
				}
			},
			{
				id: "q-num-e04",
				errorType: "logic",
				description: "reverse_list currently copies the list; it must reverse it.",
				location: "reverse_list",
				expectedCorrection: "iterate backwards, slice [::-1], or reversed()",
				marks: 2,
				validationRule: {
					type: "any",
					rules: [
						{
							type: "contains",
							value: "[::-1]"
						},
						{
							type: "regex",
							pattern: "reversed\\s*\\("
						},
						{
							type: "regex",
							pattern: "insert\\s*\\(\\s*0"
						},
						{
							type: "regex",
							pattern: "range\\s*\\(\\s*len\\s*\\(\\s*items\\s*\\)\\s*-\\s*1\\s*,\\s*-1\\s*,\\s*-1\\s*\\)"
						}
					]
				}
			}
		],
		tests: [{
			id: "q-num-t1",
			visibility: "visible",
			stdin: "",
			expectedStdout: "Fact(5) = 120\nIs 7 prime? True\nReversed: [4, 3, 2, 1]"
		}]
	},
	{
		id: "q-palindrome",
		title: "Debug the Palindrome Checker",
		language: "c",
		slot: 6,
		description: "## Objective\nDecide whether `\"level\"` is a palindrome and print `Palindrome` or `Not a palindrome`.\n\n### Watch for\n- Missing semicolons\n- Mirror index `n - i - 1`\n- `if (result = 1)` assignment",
		buggyCode: `#include <stdio.h>
#include <string.h>

int isPalindrome(char str[]) {
    int n = strlen(str)
    int i;
    for (i = 0; i < n / 2; i++) {
        if (str[i] != str[n - i])
            return 0;
    }
    return 1;
}

int main() {
    char word[20] = "level"
    int result = isPalindrome(word)
    if (result = 1)
        printf("Palindrome\\n")
    else
        printf("Not a palindrome\\n");
    return 0;
}
`,
		correctCode: `#include <stdio.h>
#include <string.h>

int isPalindrome(char str[]) {
    int n = strlen(str);
    int i;
    for (i = 0; i < n / 2; i++) {
        if (str[i] != str[n - i - 1])
            return 0;
    }
    return 1;
}

int main() {
    char word[20] = "level";
    int result = isPalindrome(word);
    if (result == 1)
        printf("Palindrome\\n");
    else
        printf("Not a palindrome\\n");
    return 0;
}
`,
		errors: [
			{
				id: "q-pal-e01",
				errorType: "syntax",
				description: "Missing semicolon after strlen(str).",
				location: "isPalindrome",
				expectedCorrection: "int n = strlen(str);",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "int\\s+n\\s*=\\s*strlen\\s*\\(\\s*str\\s*\\)\\s*;"
				}
			},
			{
				id: "q-pal-e02",
				errorType: "logic",
				description: "str[n - i] should be str[n - i - 1] to compare mirrored characters.",
				location: "comparison",
				expectedCorrection: "str[n - i - 1]",
				marks: 3,
				validationRule: {
					type: "regex",
					pattern: "str\\s*\\[\\s*n\\s*-\\s*i\\s*-\\s*1\\s*\\]"
				}
			},
			{
				id: "q-pal-e03",
				errorType: "syntax",
				description: "Missing semicolon after the word declaration.",
				location: "main",
				expectedCorrection: "char word[20] = \"level\";",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "char\\s+word\\s*\\[\\s*20\\s*\\]\\s*=\\s*\"level\"\\s*;"
				}
			},
			{
				id: "q-pal-e04",
				errorType: "syntax",
				description: "Missing semicolon after isPalindrome(word).",
				location: "main",
				expectedCorrection: "int result = isPalindrome(word);",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "int\\s+result\\s*=\\s*isPalindrome\\s*\\(\\s*word\\s*\\)\\s*;"
				}
			},
			{
				id: "q-pal-e05",
				errorType: "logic",
				description: "if (result = 1) assigns; it should compare with ==.",
				location: "if",
				expectedCorrection: "if (result == 1)",
				marks: 2,
				validationRule: {
					type: "regex",
					pattern: "if\\s*\\(\\s*result\\s*==\\s*1\\s*\\)"
				}
			},
			{
				id: "q-pal-e06",
				errorType: "syntax",
				description: "Missing semicolon after printf(\"Palindrome\\n\").",
				location: "true branch",
				expectedCorrection: "printf(\"Palindrome\\n\");",
				marks: 1,
				validationRule: {
					type: "regex",
					pattern: "printf\\(\\s*\"Palindrome\\\\n\"\\s*\\)\\s*;"
				}
			}
		],
		tests: [{
			id: "q-pal-t1",
			visibility: "visible",
			stdin: "",
			expectedStdout: "Palindrome"
		}]
	}
];
async function ensureSeeded() {
	const sql = await getSql();
	if ((await sql`select id from competition_settings where id = 'default'`).length === 0) await sql`
      insert into competition_settings (id, timer_minutes, malpractice_policy, malpractice_limit, status, questions_locked)
      values ('default', 45, 'terminate_after', 3, 'open', false)
    `;
	await insertMissingSeedQuestions();
}
async function insertMissingSeedQuestions() {
	const sql = await getSql();
	let added = 0;
	for (const [index, q] of BANK.entries()) {
		if ((await sql`select id from questions where id = ${q.id} limit 1`).length > 0) continue;
		const slot = (await sql`
      select id from questions where selected_slot = ${q.slot} limit 1
    `).length > 0 ? null : q.slot;
		await sql`
      insert into questions (id, title, language, description, buggy_code, correct_code, sort_order, selected_slot, is_active)
      values (${q.id}, ${q.title}, ${q.language}, ${q.description}, ${q.buggyCode}, ${q.correctCode}, ${index + 1}, ${slot}, true)
    `;
		for (const [ei, err] of q.errors.entries()) await sql`
        insert into question_errors (id, question_id, error_type, description, location, expected_correction, marks, validation_rule, sort_order, is_active)
        values (
          ${err.id}, ${q.id}, ${err.errorType}, ${err.description}, ${err.location},
          ${err.expectedCorrection}, ${err.marks}, ${JSON.stringify(err.validationRule)}, ${ei + 1}, true
        )
      `;
		for (const [ti, t] of q.tests.entries()) await sql`
        insert into test_cases (id, question_id, visibility, stdin, expected_stdout, sort_order)
        values (${t.id}, ${q.id}, ${t.visibility}, ${t.stdin}, ${t.expectedStdout}, ${ti + 1})
      `;
		added += 1;
	}
	return added;
}
var COOKIE = "bh_sid";
var PARTICIPANT_CODES = ["mirai2026A", "mirai2026B"];
var COORDINATOR_CODE = "mirai2026C";
function shaHex(value) {
	return createHash("sha256").update(value).digest("hex");
}
function hashedEqual(input, expected) {
	const a = createHash("sha256").update(input).digest();
	const b = createHash("sha256").update(expected).digest();
	return a.length === b.length && timingSafeEqual(a, b);
}
function matchParticipantTrack(code) {
	const trimmed = code.trim();
	if (hashedEqual(trimmed, PARTICIPANT_CODES[0])) return "A";
	if (hashedEqual(trimmed, PARTICIPANT_CODES[1])) return "B";
	return null;
}
function isCoordinatorCode(code) {
	return hashedEqual(code.trim(), COORDINATOR_CODE);
}
function cookieSecure() {
	return Boolean(process.env.DATABASE_URL);
}
async function createSession(role, participantId) {
	const sql = await getSql();
	const token = randomBytes(32).toString("hex");
	const id = randomBytes(16).toString("hex");
	const expires = new Date(Date.now() + 1728e5);
	await sql`
    insert into sessions (id, token_hash, role, participant_id, expires_at)
    values (${id}, ${shaHex(token)}, ${role}, ${participantId}, ${expires.toISOString()})
  `;
	setCookie$1(COOKIE, token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: cookieSecure(),
		maxAge: 172800
	});
}
async function clearSession() {
	const token = getCookie(COOKIE);
	if (token) await (await getSql())`delete from sessions where token_hash = ${shaHex(token)}`;
	deleteCookie$1(COOKIE, { path: "/" });
}
async function readSession() {
	const token = getCookie(COOKIE);
	if (!token) return null;
	const sql = await getSql();
	const row = (await sql`
    select id, role, participant_id, expires_at
    from sessions
    where token_hash = ${shaHex(token)}
    limit 1
  `)[0];
	if (!row) return null;
	const expires = row.expires_at instanceof Date ? row.expires_at.getTime() : Date.parse(String(row.expires_at));
	if (!Number.isFinite(expires) || expires < Date.now()) {
		await sql`delete from sessions where id = ${row.id}`;
		return null;
	}
	return {
		id: row.id,
		role: row.role,
		participantId: row.participant_id
	};
}
function nid() {
	return randomBytes(12).toString("hex");
}
function asBool(v) {
	if (typeof v === "boolean") return v;
	if (v === 1 || v === "t" || v === "true" || v === "1") return true;
	return false;
}
function asIso(v) {
	if (v == null || v === "") return null;
	if (v instanceof Date) return v.toISOString();
	const d = new Date(String(v));
	return Number.isNaN(d.getTime()) ? String(v) : d.toISOString();
}
function asInt(v, fallback = 0) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}
function parseJson(raw, fallback) {
	if (typeof raw !== "string") {
		if (raw && typeof raw === "object") return raw;
		return fallback;
	}
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
async function loadQuestions() {
	const sql = await getSql();
	const qs = await sql`select * from questions order by sort_order, title`;
	const es = await sql`select * from question_errors order by sort_order`;
	const ts = await sql`select * from test_cases order by sort_order`;
	return qs.map((q) => ({
		id: q.id,
		title: q.title,
		language: q.language,
		description: q.description,
		buggyCode: q.buggy_code,
		correctCode: q.correct_code,
		sortOrder: asInt(q.sort_order),
		selectedSlot: q.selected_slot == null ? null : asInt(q.selected_slot),
		isActive: asBool(q.is_active),
		errors: es.filter((e) => e.question_id === q.id).map((e) => ({
			id: e.id,
			questionId: e.question_id,
			errorType: e.error_type,
			description: e.description,
			location: e.location,
			expectedCorrection: e.expected_correction,
			marks: asInt(e.marks),
			validationRule: parseRule(parseJson(e.validation_rule, {})),
			sortOrder: asInt(e.sort_order),
			isActive: asBool(e.is_active)
		})),
		testCases: ts.filter((t) => t.question_id === q.id).map((t) => ({
			id: t.id,
			questionId: t.question_id,
			visibility: t.visibility,
			stdin: t.stdin,
			expectedStdout: t.expected_stdout,
			sortOrder: asInt(t.sort_order)
		}))
	}));
}
async function getSettingsRow() {
	const row = (await (await getSql())`select * from competition_settings where id = 'default'`)[0];
	if (!row) return {
		timerMinutes: 45,
		malpracticePolicy: "terminate_after",
		malpracticeLimit: 3,
		status: "open",
		questionsLocked: false
	};
	return {
		timerMinutes: asInt(row.timer_minutes, 45),
		malpracticePolicy: row.malpractice_policy,
		malpracticeLimit: asInt(row.malpractice_limit, 3),
		status: row.status,
		questionsLocked: asBool(row.questions_locked)
	};
}
function selectionMeta(questions) {
	const selected = questions.filter((q) => q.selectedSlot != null).sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
	const pythonCount = selected.filter((q) => q.language === "python").length;
	const cCount = selected.filter((q) => q.language === "c").length;
	const slots = new Set(selected.map((q) => q.selectedSlot));
	const validSlots = selected.length === 6 && slots.size === 6 && [
		1,
		2,
		3,
		4,
		5,
		6
	].every((n) => slots.has(n));
	const mixOk = pythonCount === 3 && cCount === 3;
	let startBlockReason = null;
	if (!validSlots) startBlockReason = "Select exactly six questions in slots 1–6.";
	else if (!mixOk) startBlockReason = "The selected set must contain 3 Python and 3 C questions.";
	return {
		selected,
		pythonCount,
		cCount,
		canStart: validSlots && mixOk,
		startBlockReason
	};
}
function toPublicQuestion(q, slot) {
	return {
		id: q.id,
		slot,
		title: q.title,
		language: q.language,
		description: q.description,
		buggyCode: q.buggyCode,
		maxMarks: maxMarksOf(q.errors),
		visibleTests: q.testCases.filter((t) => t.visibility === "visible").map((t) => ({
			id: t.id,
			stdin: t.stdin,
			expectedStdout: t.expectedStdout
		}))
	};
}
function toParticipantPublic(row, rank) {
	return {
		id: row.id,
		fullName: row.full_name,
		department: row.department,
		year: row.year,
		email: row.email,
		phone: row.phone,
		college: row.college,
		status: row.status,
		startedAt: asIso(row.started_at),
		completedAt: asIso(row.completed_at),
		totalMarks: asInt(row.total_marks),
		durationMs: row.duration_ms == null ? null : asInt(row.duration_ms),
		malpracticeCount: asInt(row.malpractice_count),
		currentQuestion: asInt(row.current_question, 1),
		rank
	};
}
async function loadParticipant(id) {
	return (await (await getSql())`select * from participants where id = ${id} limit 1`)[0] ?? null;
}
async function computeRanks() {
	const sorted = [...await (await getSql())`
    select * from participants
    where status in ('submitted', 'terminated')
  `].sort((a, b) => {
		const marks = asInt(b.total_marks) - asInt(a.total_marks);
		if (marks !== 0) return marks;
		const da = a.duration_ms == null ? Number.POSITIVE_INFINITY : asInt(a.duration_ms);
		const db = b.duration_ms == null ? Number.POSITIVE_INFINITY : asInt(b.duration_ms);
		if (da !== db) return da - db;
		return (Date.parse(String(a.completed_at ?? "")) || 0) - (Date.parse(String(b.completed_at ?? "")) || 0);
	});
	const map = /* @__PURE__ */ new Map();
	sorted.forEach((row, i) => map.set(row.id, i + 1));
	return map;
}
async function requireParticipantRow() {
	const session = await readSession();
	if (!session || session.role !== "participant" || !session.participantId) throw new Error("Participant session required.");
	const row = await loadParticipant(session.participantId);
	if (!row) throw new Error("Participant not found.");
	return row;
}
async function requireCoordinator() {
	const session = await readSession();
	if (!session || session.role !== "coordinator") throw new Error("Coordinator access required.");
}
async function anyExamStarted() {
	return asInt((await (await getSql())`
    select count(*)::int as n from participants
    where status in ('in_progress', 'submitted', 'terminated')
  `)[0]?.n) > 0;
}
async function getMeOp() {
	await ensureSeeded();
	const session = await readSession();
	if (!session) return { role: "anonymous" };
	if (session.role === "coordinator") return { role: "coordinator" };
	if (!session.participantId) return { role: "anonymous" };
	const row = await loadParticipant(session.participantId);
	if (!row) return { role: "anonymous" };
	return {
		role: "participant",
		participant: toParticipantPublic(row, (await computeRanks()).get(row.id) ?? null)
	};
}
async function getCompetitionPublicOp() {
	await ensureSeeded();
	const settings = await getSettingsRow();
	const meta = selectionMeta(await loadQuestions());
	return {
		timerMinutes: settings.timerMinutes,
		status: settings.status,
		malpracticePolicy: settings.malpracticePolicy,
		malpracticeLimit: settings.malpracticeLimit,
		questionsLocked: settings.questionsLocked,
		selectedCount: meta.selected.length,
		pythonCount: meta.pythonCount,
		cCount: meta.cCount,
		canStart: meta.canStart && settings.status === "open",
		startBlockReason: settings.status !== "open" ? settings.status === "closed" ? "The competition is closed." : "The coordinator has not opened the competition." : meta.startBlockReason
	};
}
async function registerOp(input) {
	await ensureSeeded();
	if (isCoordinatorCode(input.participationCode)) {
		await createSession("coordinator", null);
		return { kind: "coordinator" };
	}
	const track = matchParticipantTrack(input.participationCode);
	if (!track) throw new Error("Invalid participation code.");
	const fullName = input.fullName.trim();
	const department = input.department.trim();
	const year = input.year.trim();
	const email = input.email.trim().toLowerCase();
	const phone = input.phone.trim();
	const college = input.college.trim();
	if (fullName.length < 2) throw new Error("Full name is required.");
	if (department.length < 1) throw new Error("Department is required.");
	if (year.length < 1) throw new Error("Year is required.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("A valid email is required.");
	if (phone.length < 7) throw new Error("Phone number is required.");
	if (college.length < 2) throw new Error("College name is required.");
	if ((await getSettingsRow()).status === "closed") throw new Error("The competition is closed.");
	const sql = await getSql();
	const existing = await sql`
    select * from participants where lower(email) = ${email} limit 1
  `;
	if (existing[0]) {
		const row = existing[0];
		await createSession("participant", row.id);
		return {
			kind: "participant",
			participant: toParticipantPublic(row, (await computeRanks()).get(row.id) ?? null)
		};
	}
	const id = nid();
	await sql`
    insert into participants (
      id, full_name, department, year, email, phone, college, access_code_used, status
    ) values (
      ${id}, ${fullName}, ${department}, ${year},
      ${email}, ${phone}, ${college}, ${track}, 'registered'
    )
  `;
	await createSession("participant", id);
	const row = await loadParticipant(id);
	if (!row) throw new Error("Registration failed.");
	return {
		kind: "participant",
		participant: toParticipantPublic(row, null)
	};
}
async function updateDetailsOp(input) {
	const row = await requireParticipantRow();
	if (row.status !== "registered") throw new Error("Details can only be edited before confirmation.");
	const sql = await getSql();
	const email = input.email.trim().toLowerCase();
	await sql`
    update participants
    set full_name = ${input.fullName.trim()},
        department = ${input.department.trim()},
        year = ${input.year.trim()},
        email = ${email},
        phone = ${input.phone.trim()},
        college = ${input.college.trim()}
    where id = ${row.id}
  `;
	const next = await loadParticipant(row.id);
	if (!next) throw new Error("Update failed.");
	return toParticipantPublic(next, null);
}
async function confirmDetailsOp() {
	const row = await requireParticipantRow();
	const sql = await getSql();
	if (row.status === "registered") await sql`update participants set status = 'confirmed' where id = ${row.id}`;
	const next = await loadParticipant(row.id);
	if (!next) throw new Error("Confirmation failed.");
	return toParticipantPublic(next, null);
}
async function coordinatorLoginOp(code) {
	await ensureSeeded();
	if (!isCoordinatorCode(code)) throw new Error("Invalid coordinator access code.");
	await createSession("coordinator", null);
}
async function logoutOp() {
	await clearSession();
}
async function remainingMs(row, timerMinutes) {
	if (!row.started_at) return timerMinutes * 60 * 1e3;
	return new Date(row.started_at).getTime() + timerMinutes * 60 * 1e3 - Date.now();
}
async function finalizeParticipant(row, status) {
	const sql = await getSql();
	const total = (await sql`
    select best_marks from exam_answers where participant_id = ${row.id}
  `).reduce((sum, a) => sum + asInt(a.best_marks), 0);
	const started = row.started_at ? new Date(row.started_at).getTime() : Date.now();
	const completed = Date.now();
	const duration = Math.max(0, completed - started);
	await sql`
    update participants
    set status = ${status},
        completed_at = ${new Date(completed).toISOString()},
        total_marks = ${total},
        duration_ms = ${duration}
    where id = ${row.id} and status = 'in_progress'
  `;
	return await loadParticipant(row.id) ?? row;
}
async function startExamOp() {
	const row = await requireParticipantRow();
	const competition = await getCompetitionPublicOp();
	if (row.status === "submitted" || row.status === "terminated") throw new Error("This examination has already been submitted.");
	if (row.status === "registered") throw new Error("Confirm your details and accept the rules first.");
	if (row.status === "confirmed") {
		if (!competition.canStart) throw new Error(competition.startBlockReason ?? "Competition is not ready.");
		const sql = await getSql();
		const questions = (await loadQuestions()).filter((q) => q.selectedSlot != null);
		await sql`
      update participants
      set status = 'in_progress', started_at = ${(/* @__PURE__ */ new Date()).toISOString()}, current_question = 1
      where id = ${row.id} and status = 'confirmed'
    `;
		for (const q of questions) await sql`
        insert into exam_answers (participant_id, question_id, current_code, best_marks, best_fixed, status)
        values (${row.id}, ${q.id}, ${q.buggyCode}, 0, '[]', 'not_attempted')
        on conflict (participant_id, question_id) do nothing
      `;
	}
	return getExamStateOp();
}
async function getExamStateOp() {
	const row0 = await requireParticipantRow();
	const settings = await getSettingsRow();
	let row = row0;
	if (row.status === "in_progress") {
		if (await remainingMs(row, settings.timerMinutes) <= 0) row = await finalizeParticipant(row, "submitted");
	}
	if (row.status !== "in_progress" && row.status !== "submitted" && row.status !== "terminated") throw new Error("Examination has not started.");
	const questions = (await loadQuestions()).filter((q) => q.selectedSlot != null).sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
	const answers = await (await getSql())`select * from exam_answers where participant_id = ${row.id}`;
	const answerMap = new Map(answers.map((a) => [a.question_id, a]));
	const publicQuestions = questions.map((q) => toPublicQuestion(q, q.selectedSlot ?? 0));
	const publicAnswers = questions.map((q) => {
		const a = answerMap.get(q.id);
		const max = maxMarksOf(q.errors);
		return {
			questionId: q.id,
			slot: q.selectedSlot ?? 0,
			currentCode: a?.current_code ?? q.buggyCode,
			bestMarks: asInt(a?.best_marks),
			maxMarks: max,
			status: a?.status ?? "not_attempted",
			lastCompile: a?.last_compile ?? null,
			lastRuntime: a?.last_runtime ?? null
		};
	});
	const ranks = await computeRanks();
	const endsAt = (row.started_at ? new Date(row.started_at).getTime() : Date.now()) + settings.timerMinutes * 60 * 1e3;
	const now = Date.now();
	return {
		participant: toParticipantPublic(row, ranks.get(row.id) ?? null),
		questions: publicQuestions,
		answers: publicAnswers,
		remainingMs: Math.max(0, endsAt - now),
		serverNow: now,
		endsAt
	};
}
async function saveCodeOp(questionId, code) {
	const row = await requireParticipantRow();
	if (row.status !== "in_progress") throw new Error("Examination is locked.");
	await (await getSql())`
    update exam_answers
    set current_code = ${code}
    where participant_id = ${row.id} and question_id = ${questionId}
  `;
}
async function setCurrentQuestionOp(slot) {
	const row = await requireParticipantRow();
	if (row.status !== "in_progress") return;
	await (await getSql())`update participants set current_question = ${slot} where id = ${row.id}`;
}
async function runCodeOp(questionId, code) {
	const row = await requireParticipantRow();
	if (row.status !== "in_progress") throw new Error("Examination is locked.");
	if (!code.trim()) throw new Error("The editor is empty. Restore or type a program before running.");
	const q = (await loadQuestions()).find((item) => item.id === questionId);
	if (!q) throw new Error("Question not found.");
	const sql = await getSql();
	await sql`
    update exam_answers set current_code = ${code}
    where participant_id = ${row.id} and question_id = ${questionId}
  `;
	const execution = await executeAgainstTests(q.language, code, q.testCases, false);
	await sql`
    update exam_answers
    set last_compile = ${execution.compileOutput || null},
        last_runtime = ${execution.runtimeOutput || execution.error},
        last_tests = ${JSON.stringify(execution.tests)}
    where participant_id = ${row.id} and question_id = ${questionId}
  `;
	return execution;
}
async function submitAnswerOp(questionId, code) {
	const row = await requireParticipantRow();
	if (row.status !== "in_progress") throw new Error("Examination is locked.");
	if (!code.trim()) throw new Error("The editor is empty. Restore or type a program before submitting.");
	const q = (await loadQuestions()).find((item) => item.id === questionId);
	if (!q) throw new Error("Question not found.");
	const sql = await getSql();
	const prevFixed = parseJson((await sql`
    select best_marks, best_fixed, status from exam_answers
    where participant_id = ${row.id} and question_id = ${questionId}
    limit 1
  `)[0]?.best_fixed, []);
	const evaluation = evaluateErrors(code, q.errors);
	const merged = unionFixedIds(prevFixed, evaluation.fixed.map((e) => e.id));
	const best = marksFromFixed(q.errors, merged);
	const max = maxMarksOf(q.errors);
	const status = answerStatus(best, max, true);
	const execution = await executeAgainstTests(q.language, code, q.testCases, true);
	await sql`
    insert into submissions (
      id, participant_id, question_id, submitted_code, fixed_errors, unfixed_errors,
      marks_awarded, compile_ok, compile_output, runtime_output, test_results
    ) values (
      ${nid()}, ${row.id}, ${questionId}, ${code},
      ${JSON.stringify(evaluation.fixed.map((e) => e.id))},
      ${JSON.stringify(evaluation.unfixed.map((e) => e.id))},
      ${evaluation.marks}, ${execution.compileOk}, ${execution.compileOutput},
      ${execution.runtimeOutput || execution.error}, ${JSON.stringify(execution.tests)}
    )
  `;
	await sql`
    update exam_answers
    set current_code = ${code},
        best_marks = ${best},
        best_fixed = ${JSON.stringify(merged)},
        status = ${status},
        last_submitted_at = ${(/* @__PURE__ */ new Date()).toISOString()},
        last_compile = ${execution.compileOutput || null},
        last_runtime = ${execution.runtimeOutput || execution.error},
        last_tests = ${JSON.stringify(execution.tests)}
    where participant_id = ${row.id} and question_id = ${questionId}
  `;
	await sql`update participants set total_marks = ${(await sql`
    select best_marks from exam_answers where participant_id = ${row.id}
  `).reduce((sum, a) => sum + asInt(a.best_marks), 0)} where id = ${row.id}`;
	let message = `Awarded ${evaluation.marks} on this attempt. Best for this question is ${best} / ${max}. Previously earned marks are kept.`;
	if (execution.compileOk === false) message = `Compilation failed. Test output was not counted, but ${evaluation.marks} marks from error fixes still apply. Best remains ${best} / ${max}.`;
	else if (execution.error) message = `The sandbox could not finish running (${execution.error}). Error-fix marks still apply: ${evaluation.marks}. Best ${best} / ${max}.`;
	else if (best >= max) message = "All configured errors for this question are fixed. Marks locked at the maximum.";
	return {
		marksAwarded: evaluation.marks,
		bestMarks: best,
		maxMarks: max,
		status,
		fixedCount: evaluation.fixed.length,
		unfixedCount: evaluation.unfixed.length,
		execution,
		message
	};
}
async function finishExamOp() {
	const row = await requireParticipantRow();
	if (row.status === "submitted" || row.status === "terminated") return toParticipantPublic(row, (await computeRanks()).get(row.id) ?? null);
	if (row.status !== "in_progress") throw new Error("Examination has not started.");
	const next = await finalizeParticipant(row, "submitted");
	return toParticipantPublic(next, (await computeRanks()).get(next.id) ?? null);
}
async function logMalpracticeOp(input) {
	const row = await requireParticipantRow();
	if (row.status !== "in_progress") return {
		count: asInt(row.malpractice_count),
		terminated: false
	};
	const settings = await getSettingsRow();
	const sql = await getSql();
	const count = asInt(row.malpractice_count) + 1;
	await sql`
    insert into malpractice_logs (id, participant_id, violation_type, question_slot, violation_count)
    values (${nid()}, ${row.id}, ${input.violationType}, ${input.questionSlot}, ${count})
  `;
	await sql`update participants set malpractice_count = ${count} where id = ${row.id}`;
	let terminate = false;
	if (settings.malpracticePolicy === "immediate") terminate = true;
	if (settings.malpracticePolicy === "terminate_after" && count >= settings.malpracticeLimit) terminate = true;
	if (terminate) {
		const next = await finalizeParticipant({
			...row,
			malpractice_count: count
		}, "terminated");
		return {
			count,
			terminated: true,
			participant: toParticipantPublic(next, (await computeRanks()).get(next.id) ?? null)
		};
	}
	return {
		count,
		terminated: false
	};
}
async function getResultOp() {
	const row = await requireParticipantRow();
	if (row.status !== "submitted" && row.status !== "terminated") throw new Error("Finish the examination to view results.");
	const questions = (await loadQuestions()).filter((q) => q.selectedSlot != null).sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
	const answers = await (await getSql())`
    select question_id, best_marks, status from exam_answers where participant_id = ${row.id}
  `;
	const map = new Map(answers.map((a) => [a.question_id, a]));
	return {
		participant: toParticipantPublic(row, (await computeRanks()).get(row.id) ?? null),
		answers: questions.map((q) => ({
			slot: q.selectedSlot ?? 0,
			title: q.title,
			language: q.language,
			marks: asInt(map.get(q.id)?.best_marks),
			maxMarks: maxMarksOf(q.errors),
			status: map.get(q.id)?.status ?? "not_attempted"
		})),
		totalMax: questions.reduce((sum, q) => sum + maxMarksOf(q.errors), 0)
	};
}
async function listCoordinatorParticipantsOp() {
	await requireCoordinator();
	await ensureSeeded();
	const sql = await getSql();
	const people = await sql`select * from participants order by created_at`;
	const answers = await sql`select participant_id, question_id, best_marks from exam_answers`;
	const questions = (await loadQuestions()).filter((q) => q.selectedSlot != null).sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
	const ranks = await computeRanks();
	return people.map((p) => {
		const qMarks = questions.map((q) => {
			return asInt(answers.find((a) => a.participant_id === p.id && a.question_id === q.id)?.best_marks);
		});
		while (qMarks.length < 6) qMarks.push(0);
		return {
			id: p.id,
			rank: ranks.get(p.id) ?? null,
			fullName: p.full_name,
			department: p.department,
			year: p.year,
			email: p.email,
			phone: p.phone,
			college: p.college,
			qMarks,
			totalMarks: asInt(p.total_marks),
			durationMs: p.duration_ms == null ? null : asInt(p.duration_ms),
			status: p.status,
			malpracticeCount: asInt(p.malpractice_count),
			startedAt: asIso(p.started_at),
			completedAt: asIso(p.completed_at)
		};
	});
}
async function restoreSeedQuestionsOp() {
	await requireCoordinator();
	return { added: await insertMissingSeedQuestions() };
}
async function listQuestionsOp() {
	await requireCoordinator();
	await ensureSeeded();
	return loadQuestions();
}
async function getQuestionOp(id) {
	await requireCoordinator();
	const q = (await loadQuestions()).find((item) => item.id === id);
	if (!q) throw new Error("Question not found.");
	return q;
}
async function saveQuestionOp(input) {
	await requireCoordinator();
	try {
		if ((await getSettingsRow()).questionsLocked && await anyExamStarted()) throw new Error("Questions are locked because the competition has started.");
		const parsedErrors = input.errors.map((err, i) => {
			let rule;
			try {
				rule = parseRule(JSON.parse(err.validationRuleJson || "{}"));
			} catch {
				throw new Error(`Error ${i + 1} has invalid validation JSON.`);
			}
			return {
				...err,
				validationRule: rule
			};
		});
		const sql = await getSql();
		const id = input.id && input.id.length > 0 ? input.id : `q-${nid()}`;
		const existing = await sql`select * from questions where id = ${id} limit 1`;
		const sortOrder = existing[0] ? asInt(existing[0].sort_order) : Date.now() % 1e5;
		if (input.selectedSlot != null) await sql`
        update questions set selected_slot = null
        where selected_slot = ${input.selectedSlot} and id <> ${id}
      `;
		if (existing[0]) {
			await sql`
        update questions
        set title = ${input.title},
            language = ${input.language},
            description = ${input.description},
            buggy_code = ${input.buggyCode},
            correct_code = ${input.correctCode},
            selected_slot = ${input.selectedSlot},
            is_active = ${input.isActive}
        where id = ${id}
      `;
			await sql`delete from question_errors where question_id = ${id}`;
			await sql`delete from test_cases where question_id = ${id}`;
		} else await sql`
        insert into questions (id, title, language, description, buggy_code, correct_code, sort_order, selected_slot, is_active)
        values (${id}, ${input.title}, ${input.language}, ${input.description}, ${input.buggyCode}, ${input.correctCode}, ${sortOrder}, ${input.selectedSlot}, ${input.isActive})
      `;
		for (const [i, err] of parsedErrors.entries()) await sql`
        insert into question_errors (
          id, question_id, error_type, description, location, expected_correction, marks, validation_rule, sort_order, is_active
        ) values (
          ${err.id && err.id.length > 0 ? err.id : `${id}-e${i + 1}`},
          ${id}, ${err.errorType}, ${err.description}, ${err.location}, ${err.expectedCorrection},
          ${Math.max(0, asInt(err.marks, 1))}, ${JSON.stringify(err.validationRule)}, ${i + 1}, ${err.isActive}
        )
      `;
		for (const [i, t] of input.testCases.entries()) await sql`
        insert into test_cases (id, question_id, visibility, stdin, expected_stdout, sort_order)
        values (
          ${t.id && t.id.length > 0 ? t.id : `${id}-t${i + 1}`},
          ${id}, ${t.visibility}, ${t.stdin}, ${t.expectedStdout}, ${i + 1}
        )
      `;
		return {
			ok: true,
			id
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : "Could not save question.";
		throw new Error(message);
	}
}
async function validateAnswerKeyOp(input) {
	await requireCoordinator();
	const errors = input.errors.map((err, i) => {
		let rule;
		try {
			rule = parseRule(JSON.parse(err.validationRuleJson || "{}"));
		} catch {
			rule = {
				type: "contains",
				value: ""
			};
		}
		return {
			id: err.id && err.id.length > 0 ? err.id : `tmp-${i + 1}`,
			questionId: "draft",
			errorType: "syntax",
			description: err.description,
			location: "",
			expectedCorrection: "",
			marks: asInt(err.marks, 0),
			validationRule: rule,
			sortOrder: i + 1,
			isActive: err.isActive
		};
	});
	const tests = input.testCases.slice(0, 3).map((t, i) => ({
		id: t.id && t.id.length > 0 ? t.id : `tmp-t${i + 1}`,
		questionId: "draft",
		visibility: t.visibility,
		stdin: t.stdin,
		expectedStdout: t.expectedStdout,
		sortOrder: i + 1
	}));
	const errorChecks = errors.filter((e) => e.isActive).map((e) => {
		const alreadyPassingOnBuggy = rulePasses(input.buggyCode, e.validationRule);
		const passingOnAnswer = rulePasses(input.correctCode, e.validationRule);
		const healthy = !alreadyPassingOnBuggy && passingOnAnswer;
		let hint = "Healthy: the buggy program fails this check and the answer key passes it.";
		if (alreadyPassingOnBuggy && passingOnAnswer) hint = "This rule already matches the buggy code, so participants would score it without fixing anything. Tighten the pattern.";
		else if (!passingOnAnswer) hint = "The answer key does not match this rule. Update the correct code or the validation pattern.";
		else if (alreadyPassingOnBuggy && !passingOnAnswer) hint = "The rule matches the buggy code but not the answer key — invert or rewrite it.";
		return {
			id: e.id,
			description: e.description,
			marks: e.marks,
			alreadyPassingOnBuggy,
			passingOnAnswer,
			healthy,
			hint
		};
	});
	const execution = await executeAgainstTests(input.language, input.correctCode, tests, true);
	const healthyCount = errorChecks.filter((c) => c.healthy).length;
	const parts = [`${healthyCount}/${errorChecks.length} error rules match the answer key.`];
	if (execution.compileOk === false) parts.push("Answer key did not compile.");
	else if (execution.error) parts.push(`Sandbox: ${execution.error}`);
	else if (execution.tests.length > 0) {
		const passed = execution.tests.filter((t) => t.passed).length;
		parts.push(`Tests ${passed}/${execution.tests.length} passed on the answer key.`);
	} else if (execution.ok) parts.push("Answer key ran without a sandbox error.");
	return {
		errorChecks,
		healthyCount,
		totalErrors: errorChecks.length,
		execution,
		summary: parts.join(" ")
	};
}
async function deleteQuestionOp(id) {
	await requireCoordinator();
	if (await anyExamStarted()) throw new Error("Cannot delete questions after participants have started.");
	await (await getSql())`delete from questions where id = ${id}`;
}
async function duplicateQuestionOp(id) {
	await requireCoordinator();
	const q = await getQuestionOp(id);
	return getQuestionOp((await saveQuestionOp({
		title: `${q.title} (copy)`,
		language: q.language,
		description: q.description,
		buggyCode: q.buggyCode,
		correctCode: q.correctCode,
		selectedSlot: null,
		isActive: true,
		errors: q.errors.map((e) => ({
			errorType: e.errorType,
			description: e.description,
			location: e.location,
			expectedCorrection: e.expectedCorrection,
			marks: e.marks,
			validationRuleJson: JSON.stringify(e.validationRule),
			isActive: e.isActive
		})),
		testCases: q.testCases.map((t) => ({
			visibility: t.visibility,
			stdin: t.stdin,
			expectedStdout: t.expectedStdout
		}))
	})).id);
}
async function setQuestionSlotOp(id, slot) {
	await requireCoordinator();
	const sql = await getSql();
	if (slot != null) await sql`update questions set selected_slot = null where selected_slot = ${slot} and id <> ${id}`;
	await sql`update questions set selected_slot = ${slot} where id = ${id}`;
}
async function reorderQuestionsOp(ids) {
	await requireCoordinator();
	const sql = await getSql();
	for (const [i, id] of ids.entries()) await sql`update questions set sort_order = ${i + 1} where id = ${id}`;
}
async function updateSettingsOp(input) {
	await requireCoordinator();
	if (input.status === "open") {
		const meta = selectionMeta(await loadQuestions());
		if (!meta.canStart) throw new Error(meta.startBlockReason ?? "Select 3 Python and 3 C questions first.");
	}
	await (await getSql())`
    update competition_settings
    set timer_minutes = ${Math.max(1, Math.min(180, asInt(input.timerMinutes, 45)))},
        malpractice_policy = ${input.malpracticePolicy},
        malpractice_limit = ${Math.max(1, asInt(input.malpracticeLimit, 3))},
        status = ${input.status},
        questions_locked = ${input.questionsLocked},
        updated_at = ${(/* @__PURE__ */ new Date()).toISOString()}
    where id = 'default'
  `;
	return getCompetitionPublicOp();
}
async function getParticipantReviewOp(id) {
	await requireCoordinator();
	const participant = (await listCoordinatorParticipantsOp()).find((p) => p.id === id);
	if (!participant) throw new Error("Participant not found.");
	const questions = (await loadQuestions()).filter((q) => q.selectedSlot != null).sort((a, b) => (a.selectedSlot ?? 0) - (b.selectedSlot ?? 0));
	const sql = await getSql();
	const answers = await sql`select * from exam_answers where participant_id = ${id}`;
	const answerMap = new Map(answers.map((a) => [a.question_id, a]));
	return {
		participant,
		questions: questions.map((q) => {
			const a = answerMap.get(q.id);
			const fixed = new Set(parseJson(a?.best_fixed, []));
			const errors = q.errors.map((e) => ({
				id: e.id,
				errorType: e.errorType,
				description: e.description,
				location: e.location,
				expectedCorrection: e.expectedCorrection,
				marks: e.marks,
				fixed: fixed.has(e.id),
				awarded: fixed.has(e.id) ? e.marks : 0
			}));
			return {
				questionId: q.id,
				slot: q.selectedSlot ?? 0,
				title: q.title,
				language: q.language,
				buggyCode: q.buggyCode,
				submittedCode: a?.current_code ?? q.buggyCode,
				correctCode: q.correctCode,
				errors,
				marksAwarded: asInt(a?.best_marks),
				maxMarks: maxMarksOf(q.errors),
				submittedAt: asIso(a?.last_submitted_at ?? null),
				compileOutput: a?.last_compile ?? null,
				runtimeOutput: a?.last_runtime ?? null,
				testResults: parseJson(a?.last_tests, [])
			};
		}),
		malpractice: (await sql`
    select * from malpractice_logs where participant_id = ${id} order by occurred_at
  `).map((l) => ({
			id: l.id,
			violationType: l.violation_type,
			occurredAt: asIso(l.occurred_at) ?? "",
			questionSlot: l.question_slot == null ? null : asInt(l.question_slot),
			violationCount: asInt(l.violation_count)
		}))
	};
}
async function exportCsvOp() {
	await requireCoordinator();
	const rows = await listCoordinatorParticipantsOp();
	const lines = [[
		"Rank",
		"Name",
		"Department",
		"Year",
		"Email",
		"Phone",
		"College",
		"Q1",
		"Q2",
		"Q3",
		"Q4",
		"Q5",
		"Q6",
		"Total",
		"CompletionTimeMs",
		"Status",
		"Malpractice"
	].join(",")];
	const esc = (v) => {
		const s = v == null ? "" : String(v);
		if (/[",\n]/.test(s)) return `"${s.replace(/"/g, "\"\"")}"`;
		return s;
	};
	for (const r of [...rows].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999))) lines.push([
		r.rank,
		r.fullName,
		r.department,
		r.year,
		r.email,
		r.phone,
		r.college,
		...r.qMarks.slice(0, 6),
		r.totalMarks,
		r.durationMs,
		r.status,
		r.malpracticeCount
	].map(esc).join(","));
	return {
		filename: "mirai-bug-hunt-results.csv",
		csv: lines.join("\n")
	};
}
async function exportDetailedOp() {
	await requireCoordinator();
	const people = await listCoordinatorParticipantsOp();
	const chunks = ["MIRAI BUG HUNT — detailed answer report", ""];
	for (const p of people) {
		const review = await getParticipantReviewOp(p.id);
		chunks.push("=".repeat(72));
		chunks.push(`${p.rank ? `#${p.rank}` : "Unranked"}  ${p.fullName}  ${p.email}  ${p.totalMarks} marks  ${p.status}`);
		for (const q of review.questions) {
			chunks.push("");
			chunks.push(`Q${q.slot} ${q.title} (${q.language})  ${q.marksAwarded}/${q.maxMarks}`);
			chunks.push("-- submitted code --");
			chunks.push(q.submittedCode);
			chunks.push("-- error marking --");
			for (const e of q.errors) chunks.push(`  [${e.fixed ? "FIXED" : "OPEN"}] ${e.errorType} ${e.description} (+${e.awarded}/${e.marks})`);
		}
		chunks.push("");
	}
	return {
		filename: "mirai-bug-hunt-detailed.txt",
		text: chunks.join("\n")
	};
}
async function exportJsonOp() {
	await requireCoordinator();
	const payload = [...await listCoordinatorParticipantsOp()].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999)).map((p) => ({
		rank: p.rank,
		name: p.fullName,
		department: p.department,
		year: p.year,
		email: p.email,
		phone: p.phone,
		college: p.college,
		q1: p.qMarks[0] ?? 0,
		q2: p.qMarks[1] ?? 0,
		q3: p.qMarks[2] ?? 0,
		q4: p.qMarks[3] ?? 0,
		q5: p.qMarks[4] ?? 0,
		q6: p.qMarks[5] ?? 0,
		totalMarks: p.totalMarks,
		elapsedMs: p.durationMs,
		status: p.status,
		malpractice: p.malpracticeCount
	}));
	return {
		filename: "mirai-bug-hunt-results.json",
		json: JSON.stringify({
			competition: "MIRAI BUG HUNT",
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			participants: payload
		}, null, 2)
	};
}
//#endregion
export { confirmDetailsOp, coordinatorLoginOp, deleteQuestionOp, duplicateQuestionOp, exportCsvOp, exportDetailedOp, exportJsonOp, finishExamOp, getCompetitionPublicOp, getExamStateOp, getMeOp, getParticipantReviewOp, getQuestionOp, getResultOp, listCoordinatorParticipantsOp, listQuestionsOp, logMalpracticeOp, logoutOp, registerOp, reorderQuestionsOp, restoreSeedQuestionsOp, runCodeOp, saveCodeOp, saveQuestionOp, setCurrentQuestionOp, setQuestionSlotOp, startExamOp, submitAnswerOp, updateDetailsOp, updateSettingsOp, validateAnswerKeyOp };
