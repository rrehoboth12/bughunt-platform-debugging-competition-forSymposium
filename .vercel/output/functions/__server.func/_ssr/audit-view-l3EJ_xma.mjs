import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as formatDuration, s as rankLabel } from "./button-DV9-6TbT.mjs";
import { t as Badge } from "./badge-C8kXwOL8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-view-l3EJ_xma.js
var import_jsx_runtime = require_jsx_runtime();
function AuditView({ data }) {
	const p = data.participant;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-semibold",
				children: p.fullName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					p.department,
					" · Year ",
					p.year,
					" · ",
					p.email,
					" · ",
					p.phone,
					" · ",
					p.college
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Rank",
						value: p.rank ? rankLabel(p.rank) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total",
						value: String(p.totalMarks)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Time",
						value: formatDuration(p.durationMs)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Malpractice",
						value: String(p.malpracticeCount)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: p.qMarks.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "muted",
					children: [
						"Q",
						i + 1,
						" ",
						m
					]
				}, i))
			}),
			data.questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[var(--radius-lg)] border border-border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-lg font-semibold",
								children: [
									"Q",
									q.slot,
									" ",
									q.title
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: q.language === "python" ? "python" : "c",
								children: q.language === "python" ? "Python" : "C"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted",
								children: [
									q.marksAwarded,
									"/",
									q.maxMarks
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							label: "Original buggy code",
							code: q.buggyCode
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							label: "Participant submitted code",
							code: q.submittedCode
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mt-4 text-sm font-medium",
						children: "Point breakdown"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[11px] uppercase tracking-[0.12em] text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-3",
										children: "Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-3",
										children: "Bug"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-3",
										children: "Expected fix"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1",
										children: "Marks"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: q.errors.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3",
										children: e.errorType
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3",
										children: e.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 font-mono text-xs",
										children: e.expectedCorrection
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3",
										children: e.fixed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-success",
											children: "Fixed"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: "Untouched"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 tabular-nums",
										children: [
											e.awarded,
											"/",
											e.marks
										]
									})
								]
							}, e.id)) })]
						})
					})
				]
			}, q.questionId)),
			data.malpractice.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg font-semibold",
				children: "Malpractice log"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid gap-2 text-sm",
				children: data.malpractice.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-[var(--radius-sm)] border border-danger/30 bg-danger/5 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted",
							children: m.occurredAt
						}),
						" · ",
						m.violationType,
						m.questionSlot ? ` · Q${m.questionSlot}` : "",
						" · count ",
						m.violationCount
					]
				}, m.id))
			})] }) : null
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-md)] border border-border bg-bg-elevated p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-[0.14em] text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-xl font-semibold tabular-nums",
			children: value
		})]
	});
}
function CodeBlock({ label, code }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-1 text-[11px] uppercase tracking-[0.14em] text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "max-h-72 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg p-3 font-mono text-[11px] leading-relaxed",
		children: code
	})] });
}
//#endregion
export { AuditView as t };
