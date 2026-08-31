import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-DV9-6TbT.mjs";
import { n as GridBackdrop, t as BrandMark } from "./brand-DvFXc0fu.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CcktAedr.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as startExam, d as getMe, l as getCompetition } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rules-BLFlSY_3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RULES = [
	"The examination must be conducted in full-screen mode.",
	"Switching browser tabs, minimizing the browser, changing windows, or leaving the examination page is considered malpractice.",
	"Refreshing the page using F5 or browser refresh is prohibited.",
	"Copying, cutting, and pasting are prohibited.",
	"Print Screen and screenshot shortcuts are monitored where the browser can detect them.",
	"Remain on the examination page for the entire duration.",
	"Submit each program with SUBMIT ANSWER. End the exam with FINISH TEST before the timer ends.",
	"There is NO NEGATIVE MARKING. You receive marks for every error you successfully correct. Incorrect attempts do not deduct previously earned marks.",
	"If participants have the same final marks, completion time is the tie-breaker.",
	"A detectable malpractice violation may cause the examination to be automatically submitted or terminated."
];
function RulesPage() {
	const navigate = useNavigate();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [block, setBlock] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [minutes, setMinutes] = (0, import_react.useState)(45);
	(0, import_react.useEffect)(() => {
		(async () => {
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
			if (el.requestFullscreen) try {
				await el.requestFullscreen();
			} catch {}
			await startExam();
			await navigate({ to: "/exam" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start the test.");
		} finally {
			setPending(false);
		}
	}
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center text-muted",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridBackdrop, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-2xl px-5 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-8 glow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "BUG HUNT — important rules" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "grid gap-3",
						children: RULES.map((rule, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 font-mono text-xs text-primary",
								children: String(i + 1).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rule })]
						}, rule))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm text-muted",
						children: [
							"Official duration: ",
							minutes,
							" minutes. The timer starts only when you click Start test."
						]
					}),
					block ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-[var(--radius-sm)] border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-warn",
						children: block
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6 w-full",
						size: "lg",
						disabled: pending || Boolean(block),
						onClick: () => void start(),
						children: pending ? "Starting…" : "START TEST"
					})
				] })]
			})]
		})]
	});
}
//#endregion
export { RulesPage as component };
