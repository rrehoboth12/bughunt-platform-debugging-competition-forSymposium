import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, l as Dialog$1, m as DialogPortal$1, p as DialogOverlay$1, u as DialogClose, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as formatDuration, o as friendlyRpcError, r as cn, s as rankLabel, t as Button } from "./button-DV9-6TbT.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as exportCsv, f as getParticipantReview, h as listCoordinatorParticipants, l as getCompetition, o as exportDetailed, s as exportJson } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-C8kXwOL8.mjs";
import { t as AuditView } from "./audit-view-l3EJ_xma.mjs";
import { t as CoordShell } from "./coord-shell-Od0f1Z0e.mjs";
import { f as Pencil, m as Download, t as X, u as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-B-CwU2kQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-bg/80", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-6 shadow-none", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-[var(--radius-xs)] p-1 text-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-6", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("font-display text-lg font-semibold", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function DashboardPage() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [comp, setComp] = (0, import_react.useState)(null);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [review, setReview] = (0, import_react.useState)(null);
	const [reviewError, setReviewError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		Promise.all([listCoordinatorParticipants(), getCompetition()]).then(([people, c]) => {
			setRows(people);
			setComp(c);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!openId) {
			setReview(null);
			setReviewError(null);
			return;
		}
		setReview(null);
		setReviewError(null);
		getParticipantReview({ data: { id: openId } }).then(setReview).catch((err) => setReviewError(err instanceof Error ? err.message : "Could not load audit."));
	}, [openId]);
	async function downloadCsv() {
		try {
			const file = await exportCsv();
			triggerDownload(file.filename, file.csv, "text/csv");
		} catch (err) {
			toast.error(friendlyRpcError(err, "Export failed."));
		}
	}
	async function downloadJson() {
		try {
			const file = await exportJson();
			triggerDownload(file.filename, file.json, "application/json");
		} catch (err) {
			toast.error(friendlyRpcError(err, "Export failed."));
		}
	}
	async function downloadDetailed() {
		try {
			const file = await exportDetailed();
			triggerDownload(file.filename, file.text, "text/plain");
		} catch (err) {
			toast.error(friendlyRpcError(err, "Export failed."));
		}
	}
	const ranked = [...rows].sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CoordShell, {
		active: "results",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Results"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: comp ? `Competition ${comp.status} · ${comp.pythonCount} Python + ${comp.cCount} C selected` : "Loading…"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void downloadCsv(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void downloadJson(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "JSON"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void downloadDetailed(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Answer report"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-primary/30 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Question bank & answer keys"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: ["Update buggy programs, paste the correct answers, and set marks for each error.", comp ? ` Current mix: ${comp.pythonCount} Python + ${comp.cCount} C selected.` : null]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/coordinator/questions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), "Manage questions"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/coordinator/questions/$id",
							params: { id: "new" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Add question"]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[960px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-bg-subtle text-[11px] uppercase tracking-[0.12em] text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"Rank",
							"Name",
							"Dept",
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
							"Time",
							"Status",
							"Malpractice"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ranked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 17,
						className: "px-3 py-8 text-center text-muted",
						children: "No participants yet."
					}) }) : ranked.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => setOpenId(r.id),
						className: cn("cursor-pointer border-t border-border transition-colors hover:bg-bg-subtle", r.rank === 1 ? "bg-gold/10 ring-1 ring-inset ring-gold/70" : r.rank === 2 ? "bg-silver/10 ring-1 ring-inset ring-silver/70" : r.rank === 3 ? "bg-bronze/10 ring-1 ring-inset ring-bronze/70" : "bg-bg-elevated"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono",
								children: r.rank ? rankLabel(r.rank) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-medium",
								children: r.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-muted",
								children: r.department
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-muted",
								children: r.year
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-muted",
								children: r.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-muted",
								children: r.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "max-w-36 truncate px-3 py-2 text-muted",
								children: r.college
							}),
							r.qMarks.slice(0, 6).map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: m
							}, i)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-medium tabular-nums",
								children: r.totalMarks
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs",
								children: formatDuration(r.durationMs)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: r.status === "submitted" ? "success" : r.status === "terminated" ? "danger" : r.status === "in_progress" ? "warn" : "muted",
									children: r.status.replace("_", " ")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: r.malpracticeCount
							})
						]
					}, r.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(openId),
				onOpenChange: (open) => !open && setOpenId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-h-[90vh] max-w-5xl overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Winner audit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Original buggy code versus the participant submission, with a point breakdown of each configured bug." })] }),
						reviewError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: reviewError
						}) : null,
						!review && !reviewError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Loading verification record…"
						}) : null,
						review ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditView, { data: review }) : null
					]
				})
			})
		]
	});
}
function triggerDownload(filename, content, type) {
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { DashboardPage as component };
