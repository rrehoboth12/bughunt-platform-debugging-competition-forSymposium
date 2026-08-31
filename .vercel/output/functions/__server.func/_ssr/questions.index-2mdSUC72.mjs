import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as friendlyRpcError, t as Button } from "./button-DV9-6TbT.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as setQuestionSlot, b as reorderQuestions, g as listQuestions, i as duplicateQuestion, l as getCompetition, r as deleteQuestion, x as restoreSeedQuestions } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-C8kXwOL8.mjs";
import { t as CoordShell } from "./coord-shell-Od0f1Z0e.mjs";
import { f as Pencil, h as Copy, i as Trash2, u as Plus, v as ChevronUp, x as ChevronDown } from "../_libs/lucide-react.mjs";
import { i as maxMarksOf } from "./scoring-CMKFoFoW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/questions.index-2mdSUC72.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuestionsPage() {
	const navigate = useNavigate();
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [comp, setComp] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	async function reload() {
		const [qs, c] = await Promise.all([listQuestions(), getCompetition()]);
		setQuestions(qs);
		setComp(c);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		reload().catch((err) => {
			setLoading(false);
			toast.error(friendlyRpcError(err, "Could not load questions."));
		});
	}, []);
	async function setSlot(id, slot) {
		try {
			await setQuestionSlot({ data: {
				id,
				slot
			} });
			await reload();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update slot.");
		}
	}
	async function dup(id) {
		try {
			const q = await duplicateQuestion({ data: { id } });
			await navigate({
				to: "/coordinator/questions/$id",
				params: { id: q.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Duplicate failed.");
		}
	}
	async function remove(id) {
		if (!confirm("Delete this question from the bank?")) return;
		try {
			await deleteQuestion({ data: { id } });
			await reload();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed.");
		}
	}
	async function move(index, dir) {
		const next = [...questions];
		const target = index + dir;
		if (target < 0 || target >= next.length) return;
		const tmp = next[index];
		next[index] = next[target];
		next[target] = tmp;
		setQuestions(next);
		try {
			await reorderQuestions({ data: { ids: next.map((q) => q.id) } });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not reorder.");
			await reload();
		}
	}
	const mixOk = (comp?.pythonCount ?? 0) === 3 && (comp?.cCount ?? 0) === 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CoordShell, {
		active: "questions",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Question bank"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "Add, edit, and set the hidden answer key for each debugging question. Select exactly six for the live competition: 3 Python and 3 C."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => void restoreSeedQuestions().then(async (res) => {
							toast.success(res.added ? `Restored ${res.added} starter question${res.added === 1 ? "" : "s"}.` : "Starter questions are already in the bank.");
							await reload();
						}).catch((err) => toast.error(err instanceof Error ? err.message : "Restore failed.")),
						children: "Restore starter questions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/coordinator/questions/$id",
							params: { id: "new" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add question"]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-5 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${mixOk ? "border-success/30 bg-success/10 text-success" : "border-warn/30 bg-warn/10 text-warn"}`,
				children: comp ? mixOk ? `Ready: ${comp.pythonCount} Python + ${comp.cCount} C selected for slots 1–6.` : `Not ready: currently ${comp.pythonCount} Python + ${comp.cCount} C selected. Choose 3 of each and assign slots Q1–Q6.` : "Loading competition mix…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Loading question bank…"
				}) : questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-lg)] border border-dashed border-border px-6 py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "No questions yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Add a Python or C debugging question, paste the buggy code, then enter the correct answer and scoring errors."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/coordinator/questions/$id",
								params: { id: "new" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add the first question"]
							})
						})
					]
				}) : questions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 flex-col gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8",
								onClick: () => void move(i, -1),
								disabled: i === 0,
								"aria-label": "Move up",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8",
								onClick: () => void move(i, 1),
								disabled: i === questions.length - 1,
								"aria-label": "Move down",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: q.language === "python" ? "python" : "c",
											children: q.language === "python" ? "Python" : "C"
										}),
										q.selectedSlot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["Slot ", q.selectedSlot] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "muted",
											children: "Not selected"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted",
											children: [
												q.errors.length,
												" errors · ",
												maxMarksOf(q.errors),
												" marks"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-medium",
									children: q.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-xs text-muted",
									children: q.correctCode.trim() ? "Answer key saved. Click Edit to update buggy code, correct code, and marks." : "No answer key yet — open Edit to paste the correct code and define errors."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-11 rounded-[var(--radius-sm)] border border-border bg-bg px-2 text-sm",
									value: q.selectedSlot ?? "",
									onChange: (e) => void setSlot(q.id, e.target.value ? Number(e.target.value) : null),
									"aria-label": `Competition slot for ${q.title}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "No slot"
									}), [
										1,
										2,
										3,
										4,
										5,
										6
									].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: n,
										children: ["Q", n]
									}, n))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/coordinator/questions/$id",
										params: { id: q.id },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), "Edit & answer key"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => void dup(q.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Duplicate"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => void remove(q.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})
							]
						})
					]
				}, q.id))
			})
		]
	});
}
//#endregion
export { QuestionsPage as component };
