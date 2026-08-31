import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-DV9-6TbT.mjs";
import { A as updateSettings, l as getCompetition } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-DtbU2b2C.mjs";
import { t as CoordShell } from "./coord-shell-Od0f1Z0e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-D8C7b9FP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const [comp, setComp] = (0, import_react.useState)(null);
	const [timerMinutes, setTimerMinutes] = (0, import_react.useState)(45);
	const [policy, setPolicy] = (0, import_react.useState)("terminate_after");
	const [limit, setLimit] = (0, import_react.useState)(3);
	const [status, setStatus] = (0, import_react.useState)("open");
	const [locked, setLocked] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCompetition().then((c) => {
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
			const next = await updateSettings({ data: {
				timerMinutes,
				malpracticePolicy: policy,
				malpracticeLimit: limit,
				status,
				questionsLocked: locked
			} });
			setComp(next);
			toast.success("Settings saved.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not save settings.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CoordShell, {
		active: "settings",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Competition settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: ["Opening the competition requires exactly six selected questions: 3 Python and 3 C.", comp ? ` Current mix: ${comp.pythonCount} Python + ${comp.cCount} C.` : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid max-w-xl gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Timer (minutes)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							max: 180,
							value: timerMinutes,
							onChange: (e) => setTimerMinutes(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Competition status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm",
							value: status,
							onChange: (e) => setStatus(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "setup",
									children: "Setup — participants cannot start"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "open",
									children: "Open — participants may start"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "closed",
									children: "Closed"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Malpractice policy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm",
							value: policy,
							onChange: (e) => setPolicy(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "log_only",
									children: "Log only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "terminate_after",
									children: "Terminate after N events"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "immediate",
									children: "Terminate on first event"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Malpractice limit (N)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							max: 20,
							value: limit,
							onChange: (e) => setLimit(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: locked,
							onChange: (e) => setLocked(e.target.checked)
						}), "Lock question bank after start"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						disabled: pending,
						className: "w-fit",
						children: pending ? "Saving…" : "Save settings"
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
