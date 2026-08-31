import { o as __toESM } from "../_runtime.mjs";
import { a as Overlay2, b as require_react, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as formatClock, n as buttonVariants, o as friendlyRpcError, r as cn, t as Button } from "./button-DV9-6TbT.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as saveCode, O as submitAnswer, S as runCode, T as setCurrentQuestion, _ as logMalpractice, c as finishExam, u as getExamState } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-C8kXwOL8.mjs";
import { a as Square, b as ChevronLeft, c as Send, d as Play, l as RotateCcw, p as Maximize2, y as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as CodeEditor } from "./code-editor-DVmg92s9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exam-pD_jKdkK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function inline(text) {
	const parts = [];
	const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
	let last = 0;
	let key = 0;
	let match;
	while (match = re.exec(text)) {
		if (match.index > last) parts.push(text.slice(last, match.index));
		const token = match[0];
		if (token.startsWith("`")) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-[4px] bg-bg-subtle px-1 font-mono text-[0.9em] text-primary",
			children: token.slice(1, -1)
		}, key++));
		else if (token.startsWith("**")) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-fg",
			children: token.slice(2, -2)
		}, key++));
		else parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: token.slice(1, -1) }, key++));
		last = match.index + token.length;
	}
	if (last < text.length) parts.push(text.slice(last));
	return parts;
}
function Markdown({ text, className }) {
	const lines = text.replace(/\r\n/g, "\n").split("\n");
	const nodes = [];
	let i = 0;
	let para = [];
	let list = null;
	let fence = null;
	function flushPara() {
		if (!para.length) return;
		nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-muted",
			children: inline(para.join(" "))
		}, i++));
		para = [];
	}
	function flushList() {
		if (!list) return;
		const Tag = list.ordered ? "ol" : "ul";
		nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			className: cn("my-1 space-y-1 pl-5 text-sm text-muted", list.ordered ? "list-decimal" : "list-disc"),
			children: list.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(item) }, idx))
		}, i++));
		list = null;
	}
	for (const line of lines) {
		if (fence) {
			if (line.startsWith("```")) {
				nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "my-2 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg-subtle p-3 font-mono text-[12px] leading-relaxed text-fg",
					children: fence.join("\n")
				}, i++));
				fence = null;
			} else fence.push(line);
			continue;
		}
		if (line.startsWith("```")) {
			flushPara();
			flushList();
			fence = [];
			continue;
		}
		const heading = /^(#{1,3})\s+(.*)$/.exec(line);
		if (heading) {
			flushPara();
			flushList();
			const level = heading[1].length;
			const cls = level === 1 ? "font-display text-lg font-semibold text-fg" : level === 2 ? "font-display text-base font-semibold text-fg" : "text-sm font-semibold text-fg";
			nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-3 first:mt-0", cls),
				children: inline(heading[2])
			}, i++));
			continue;
		}
		const ul = /^[-*]\s+(.*)$/.exec(line);
		const ol = /^\d+\.\s+(.*)$/.exec(line);
		if (ul || ol) {
			flushPara();
			const ordered = Boolean(ol);
			if (!list || list.ordered !== ordered) {
				flushList();
				list = {
					ordered,
					items: []
				};
			}
			list.items.push(ul?.[1] ?? ol?.[1] ?? "");
			continue;
		}
		if (line.trim() === "") {
			flushPara();
			flushList();
			continue;
		}
		flushList();
		para.push(line.trim());
	}
	flushPara();
	flushList();
	if (fence) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "my-2 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg-subtle p-3 font-mono text-[12px] text-fg",
		children: fence.join("\n")
	}, i++));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid gap-2", className),
		children: nodes
	});
}
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	ref,
	className: cn("fixed inset-0 z-50 bg-bg/80", className),
	...props
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-6", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-2", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("font-display text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function statusLabel(status) {
	if (status === "correct") return "Correct";
	if (status === "partial") return "Partially Correct";
	if (status === "attempted") return "Attempted";
	return "Not Attempted";
}
function statusTone(status) {
	if (status === "correct") return "border-success/50 bg-success/15 text-success";
	if (status === "partial") return "border-partial/50 bg-partial/15 text-partial";
	if (status === "attempted") return "border-warn/50 bg-warn/15 text-warn";
	return "border-border bg-bg-subtle text-muted";
}
function ExamPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [slot, setSlot] = (0, import_react.useState)(1);
	const [codes, setCodes] = (0, import_react.useState)({});
	const [remaining, setRemaining] = (0, import_react.useState)(0);
	const [output, setOutput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [finishOpen, setFinishOpen] = (0, import_react.useState)(false);
	const [terminated, setTerminated] = (0, import_react.useState)(false);
	const [fsHeld, setFsHeld] = (0, import_react.useState)(false);
	const armed = (0, import_react.useRef)(false);
	const slotRef = (0, import_react.useRef)(1);
	const lastLog = (0, import_react.useRef)({});
	const finished = (0, import_react.useRef)(false);
	const current = questions.find((q) => q.slot === slot) ?? questions[0];
	const currentAnswer = answers.find((a) => a.questionId === current?.id);
	const load = (0, import_react.useCallback)(async () => {
		try {
			const state = await getExamState();
			if (state.participant.status === "terminated") {
				setTerminated(true);
				return;
			}
			if (state.participant.status === "submitted") {
				await navigate({ to: "/result" });
				return;
			}
			setQuestions(state.questions);
			setAnswers(state.answers);
			setRemaining(Math.ceil(state.remainingMs / 1e3));
			setCodes((prev) => {
				const next = { ...prev };
				for (const a of state.answers) if (next[a.questionId] == null) next[a.questionId] = a.currentCode;
				return next;
			});
			setSlot(state.participant.currentQuestion || 1);
			slotRef.current = state.participant.currentQuestion || 1;
		} catch {
			await navigate({ to: "/register" });
		} finally {
			setLoading(false);
		}
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => {
			armed.current = true;
		}, 2500);
		return () => window.clearTimeout(t);
	}, []);
	(0, import_react.useEffect)(() => {
		const el = document.documentElement;
		if (el.requestFullscreen) el.requestFullscreen().then(() => setFsHeld(true)).catch(() => void 0);
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			setRemaining((s) => {
				if (s <= 1) {
					if (!finished.current) {
						finished.current = true;
						finishExam().then(() => navigate({ to: "/result" }));
					}
					return 0;
				}
				return s - 1;
			});
		}, 1e3);
		return () => window.clearInterval(id);
	}, [navigate]);
	const report = (0, import_react.useCallback)(async (violationType) => {
		if (!armed.current || finished.current) return;
		const now = Date.now();
		if ((lastLog.current[violationType] ?? 0) > now - 2e3) return;
		lastLog.current[violationType] = now;
		try {
			if ((await logMalpractice({ data: {
				violationType,
				questionSlot: slotRef.current
			} })).terminated) {
				finished.current = true;
				setTerminated(true);
			}
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const onVis = () => {
			if (document.hidden) report("visibility");
		};
		const onBlur = () => void report("blur");
		const onFs = () => {
			const on = Boolean(document.fullscreenElement);
			if (!on && fsHeld) report("fullscreen_exit");
			setFsHeld(on);
		};
		const block = (e, type) => {
			e.preventDefault();
			report(type);
		};
		const onKey = (e) => {
			const key = e.key.toLowerCase();
			if (e.key === "F5" || (e.ctrlKey || e.metaKey) && key === "r") {
				e.preventDefault();
				report("refresh");
			}
			if ((e.ctrlKey || e.metaKey) && (key === "c" || key === "x" || key === "v")) {
				e.preventDefault();
				report(key === "c" ? "copy" : key === "x" ? "cut" : "paste");
			}
			if (e.key === "PrintScreen") {
				e.preventDefault();
				report("print_screen");
			}
		};
		const onCopy = (e) => block(e, "copy");
		const onCut = (e) => block(e, "cut");
		const onPaste = (e) => block(e, "paste");
		const onContext = (e) => {
			e.preventDefault();
			report("contextmenu");
		};
		const onLeave = (e) => {
			e.preventDefault();
			e.returnValue = "";
			report("navigation");
		};
		document.addEventListener("visibilitychange", onVis);
		window.addEventListener("blur", onBlur);
		document.addEventListener("fullscreenchange", onFs);
		document.addEventListener("copy", onCopy);
		document.addEventListener("cut", onCut);
		document.addEventListener("paste", onPaste);
		document.addEventListener("keydown", onKey);
		document.addEventListener("contextmenu", onContext);
		window.addEventListener("beforeunload", onLeave);
		return () => {
			document.removeEventListener("visibilitychange", onVis);
			window.removeEventListener("blur", onBlur);
			document.removeEventListener("fullscreenchange", onFs);
			document.removeEventListener("copy", onCopy);
			document.removeEventListener("cut", onCut);
			document.removeEventListener("paste", onPaste);
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("contextmenu", onContext);
			window.removeEventListener("beforeunload", onLeave);
		};
	}, [fsHeld, report]);
	async function go(nextSlot) {
		if (!current) return;
		const code = codes[current.id] ?? "";
		saveCode({ data: {
			questionId: current.id,
			code
		} });
		setSlot(nextSlot);
		slotRef.current = nextSlot;
		setCurrentQuestion({ data: { slot: nextSlot } });
	}
	async function onRun() {
		if (!current) return;
		const source = codes[current.id] ?? "";
		if (!source.trim()) {
			toast.error("The editor is empty. Restore or type a program before running.");
			return;
		}
		setBusy("run");
		try {
			const res = await runCode({ data: {
				questionId: current.id,
				code: source
			} });
			const lines = [
				res.compileOk === false ? "Compilation failed. Fix syntax, then run again." : null,
				res.error ? `Sandbox: ${res.error}` : null,
				res.compileOutput ? `Compile:\n${res.compileOutput}` : null,
				res.runtimeOutput ? `Output:\n${res.runtimeOutput}` : null,
				...res.tests.map((t) => `Test ${t.id.slice(-4)}: ${t.passed ? "PASS" : "FAIL"}${t.stderr ? `\n${t.stderr}` : ""}`)
			].filter(Boolean);
			setOutput(lines.join("\n\n") || "No output.");
		} catch (err) {
			setOutput(friendlyRpcError(err, "Run failed."));
			toast.error(friendlyRpcError(err, "Run failed."));
		} finally {
			setBusy(null);
		}
	}
	async function onSubmit() {
		if (!current) return;
		const source = codes[current.id] ?? "";
		if (!source.trim()) {
			toast.error("The editor is empty. Restore or type a program before submitting.");
			return;
		}
		setBusy("submit");
		try {
			const res = await submitAnswer({ data: {
				questionId: current.id,
				code: source
			} });
			toast.success(res.message);
			setAnswers((prev) => prev.map((a) => a.questionId === current.id ? {
				...a,
				bestMarks: res.bestMarks,
				status: res.status
			} : a));
			const exec = res.execution;
			const testLines = exec.tests.map((t) => `${t.passed ? "PASS" : "FAIL"} ${t.id.slice(-4)}${t.stderr ? `\n${t.stderr}` : ""}`);
			setOutput([
				res.message,
				exec.compileOk === false ? "Compilation failed — test output was not counted. Error-fix marks still apply." : null,
				exec.error ? `Sandbox: ${exec.error}` : null,
				exec.compileOutput ? `Compile:\n${exec.compileOutput}` : null,
				exec.runtimeOutput ? `Output:\n${exec.runtimeOutput}` : null,
				testLines.length ? `Tests:\n${testLines.join("\n")}` : null,
				`This attempt: ${res.marksAwarded}  ·  Best: ${res.bestMarks}/${res.maxMarks}  ·  Fixed ${res.fixedCount}, remaining ${res.unfixedCount}`
			].filter(Boolean).join("\n\n"));
		} catch (err) {
			toast.error(friendlyRpcError(err, "Submit failed. Your previous marks were not reduced."));
		} finally {
			setBusy(null);
		}
	}
	function resetCode() {
		if (!current) return;
		setCodes((prev) => ({
			...prev,
			[current.id]: current.buggyCode
		}));
	}
	async function confirmFinish() {
		try {
			finished.current = true;
			if (current) await saveCode({ data: {
				questionId: current.id,
				code: codes[current.id] ?? ""
			} });
			await finishExam();
			await navigate({ to: "/result" });
		} catch (err) {
			finished.current = false;
			toast.error(err instanceof Error ? err.message : "Could not finish.");
		}
	}
	async function reenterFullscreen() {
		try {
			await document.documentElement.requestFullscreen();
			setFsHeld(true);
		} catch {
			toast.error("Fullscreen is blocked in this browser. Stay on this tab.");
		}
	}
	const lowTime = remaining <= 60;
	const code = current ? codes[current.id] ?? "" : "";
	const nav = (0, import_react.useMemo)(() => questions, [questions]);
	if (terminated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-lg rounded-[var(--radius-xl)] border border-danger/40 bg-danger/10 p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.22em] text-danger",
					children: "TEST TERMINATED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-2xl font-semibold leading-snug sm:text-3xl",
					children: "A prohibited activity was detected and your examination has been automatically submitted."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6",
					onClick: () => void navigate({ to: "/result" }),
					children: "View result"
				})
			]
		})
	});
	if (loading || !current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center text-muted",
		children: "Loading examination…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 items-center gap-3 border-b border-border px-3 py-2 sm:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-sm font-semibold tracking-wide",
						children: "MIRAI — BUG HUNT"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] uppercase tracking-[0.16em] text-muted",
						children: [
							"Question ",
							current.slot,
							" / 6"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						!fsHeld ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => void reenterFullscreen(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3.5" }), "Fullscreen"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("rounded-[var(--radius-sm)] border px-3 py-1 font-mono text-lg tabular-nums", lowTime ? "border-danger/40 bg-danger/10 text-danger glow-danger" : "border-primary/30 bg-primary/10 text-fg glow-cyan"),
							children: formatClock(remaining)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setFinishOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), "Finish"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 lg:grid-cols-[13rem_minmax(16rem,22rem)_1fr]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "min-h-0 overflow-auto border-b border-border p-3 lg:border-b-0 lg:border-r",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-[0.16em] text-muted",
							children: "Questions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid grid-cols-3 gap-2 lg:grid-cols-2",
							children: nav.map((q) => {
								const status = answers.find((x) => x.questionId === q.id)?.status ?? "not_attempted";
								const active = q.slot === slot;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void go(q.slot),
									className: cn("min-h-11 rounded-[var(--radius-sm)] border px-2 py-2 text-left transition-[border-color,background-color,box-shadow] duration-150", statusTone(status), active && "ring-2 ring-primary/70 glow-cyan"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-xs font-semibold",
										children: ["Q", q.slot]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-[10px] leading-tight",
										children: statusLabel(status)
									})]
								}, q.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "min-h-0 overflow-auto border-b border-border p-4 lg:border-b-0 lg:border-r",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: current.language === "python" ? "python" : "c",
										children: current.language === "python" ? "Python" : "C"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary",
										children: ["Max ", current.maxMarks]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted",
										children: ["Best ", currentAnswer?.bestMarks ?? 0]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-lg font-semibold leading-snug",
								children: current.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
								className: "mt-3",
								text: current.description
							}),
							current.visibleTests.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] uppercase tracking-[0.16em] text-muted",
									children: "Visible tests"
								}), current.visibleTests.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-2 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg-subtle p-3 font-mono text-[11px] text-fg",
									children: t.expectedStdout
								}, t.id))]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex min-h-0 flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-h-0 flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeEditor, {
									language: current.language,
									value: code,
									onChange: (v) => setCodes((prev) => ({
										...prev,
										[current.id]: v
									}))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-wrap gap-2 border-t border-border p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => void onRun(),
										disabled: !!busy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), busy === "run" ? "Running…" : "RUN CODE"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => void onSubmit(),
										disabled: !!busy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }), busy === "submit" ? "Submitting…" : "SUBMIT ANSWER"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: resetCode,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "RESET CODE"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ml-auto flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											disabled: slot <= 1,
											onClick: () => void go(slot - 1),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-3.5" }), "PREVIOUS"]
										}), slot < 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => void go(slot + 1),
											children: ["NEXT", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setFinishOpen(true),
											children: "FINISH TEST"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-32 shrink-0 overflow-auto border-t border-border bg-bg-elevated p-3 font-mono text-xs whitespace-pre-wrap text-muted",
								children: output || "Run or submit to see compiler / runtime output."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: finishOpen,
				onOpenChange: setFinishOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Finish BUG HUNT?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Are you sure you want to finish BUG HUNT? Your answers cannot be changed after final submission." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Continue exam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => void confirmFinish(),
					children: "FINISH TEST"
				})] })] })
			})
		]
	});
}
//#endregion
export { ExamPage as component };
