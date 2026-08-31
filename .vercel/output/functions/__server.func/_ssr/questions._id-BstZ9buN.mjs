import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as friendlyRpcError, r as cn, t as Button } from "./button-DV9-6TbT.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { j as validateAnswerKey, p as getQuestion, w as saveQuestion } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-DtbU2b2C.mjs";
import { t as CoordShell } from "./coord-shell-Od0f1Z0e.mjs";
import { C as ArrowLeft, i as Trash2, s as ShieldCheck, u as Plus } from "../_libs/lucide-react.mjs";
import { t as CodeEditor } from "./code-editor-DVmg92s9.mjs";
import { o as parseRule } from "./scoring-CMKFoFoW.mjs";
import { n as Route } from "./router-BJnnWVit.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/questions._id-BstZ9buN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 py-2 font-mono text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function emptyError() {
	return {
		errorType: "syntax",
		description: "",
		location: "",
		expectedCorrection: "",
		marks: 2,
		ruleType: "contains",
		ruleValue: "",
		isActive: true
	};
}
function ruleToDraft(rule) {
	if (rule.type === "contains" || rule.type === "not_contains") return {
		ruleType: rule.type,
		ruleValue: rule.value
	};
	if (rule.type === "regex") return {
		ruleType: "regex",
		ruleValue: rule.pattern
	};
	return {
		ruleType: "json",
		ruleValue: JSON.stringify(rule, null, 2)
	};
}
function draftToRule(d) {
	if (d.ruleType === "regex") return {
		type: "regex",
		pattern: d.ruleValue
	};
	if (d.ruleType === "json") try {
		return parseRule(JSON.parse(d.ruleValue || "{}"));
	} catch {
		throw new Error("One error has invalid JSON validation. Fix it before saving.");
	}
	return {
		type: d.ruleType,
		value: d.ruleValue
	};
}
function QuestionEditorPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const isNew = id === "new";
	const [title, setTitle] = (0, import_react.useState)("");
	const [language, setLanguage] = (0, import_react.useState)("python");
	const [description, setDescription] = (0, import_react.useState)("");
	const [buggyCode, setBuggyCode] = (0, import_react.useState)("");
	const [correctCode, setCorrectCode] = (0, import_react.useState)("");
	const [selectedSlot, setSelectedSlot] = (0, import_react.useState)(null);
	const [isActive, setIsActive] = (0, import_react.useState)(true);
	const [errors, setErrors] = (0, import_react.useState)(isNew ? [emptyError()] : []);
	const [tests, setTests] = (0, import_react.useState)([]);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(false);
	const [report, setReport] = (0, import_react.useState)(null);
	const [loaded, setLoaded] = (0, import_react.useState)(isNew);
	(0, import_react.useEffect)(() => {
		if (isNew) return;
		getQuestion({ data: { id } }).then((q) => {
			setTitle(q.title);
			setLanguage(q.language);
			setDescription(q.description);
			setBuggyCode(q.buggyCode);
			setCorrectCode(q.correctCode);
			setSelectedSlot(q.selectedSlot);
			setIsActive(q.isActive);
			setErrors(q.errors.map((e) => ({
				id: e.id,
				errorType: e.errorType,
				description: e.description,
				location: e.location,
				expectedCorrection: e.expectedCorrection,
				marks: e.marks,
				isActive: e.isActive,
				...ruleToDraft(e.validationRule)
			})));
			setTests(q.testCases.map((t) => ({
				id: t.id,
				visibility: t.visibility,
				stdin: t.stdin,
				expectedStdout: t.expectedStdout
			})));
			setLoaded(true);
		}).catch((err) => toast.error(friendlyRpcError(err, "Could not load question.")));
	}, [id, isNew]);
	function payload() {
		return {
			id: isNew ? void 0 : id,
			title: title.trim(),
			language,
			description: description.trim(),
			buggyCode,
			correctCode,
			selectedSlot,
			isActive,
			errors: errors.map((e) => ({
				id: e.id,
				errorType: e.errorType,
				description: e.description,
				location: e.location,
				expectedCorrection: e.expectedCorrection,
				marks: Number.isFinite(e.marks) ? e.marks : 0,
				isActive: e.isActive,
				validationRuleJson: JSON.stringify(draftToRule(e))
			})),
			testCases: tests
		};
	}
	function validateForm() {
		if (title.trim().length < 2) {
			toast.error("Enter a question title.");
			return false;
		}
		if (description.trim().length < 8) {
			toast.error("Enter a short description shown to participants.");
			return false;
		}
		if (!buggyCode.trim()) {
			toast.error("Paste the buggy program participants will debug.");
			return false;
		}
		if (!correctCode.trim()) {
			toast.error("Paste the correct / expected answer code. Participants never see this.");
			return false;
		}
		if (errors.length === 0) {
			toast.error("Add at least one error with an expected correction and marks.");
			return false;
		}
		if (errors.some((e) => !e.description.trim() || !e.expectedCorrection.trim())) {
			toast.error("Every error needs a description and an expected correction.");
			return false;
		}
		try {
			errors.forEach((e) => draftToRule(e));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Fix validation rules before saving.");
			return false;
		}
		return true;
	}
	async function save() {
		if (!validateForm()) return;
		setPending(true);
		try {
			const saved = await saveQuestion({ data: payload() });
			toast.success("Question and answer key saved. Checking the answer key…");
			if (isNew) await navigate({
				to: "/coordinator/questions/$id",
				params: { id: saved.id }
			});
			setChecking(true);
			try {
				const next = await validateAnswerKey({ data: payload() });
				setReport(next);
				toast.success(next.summary);
			} catch (err) {
				toast.error(friendlyRpcError(err, "Saved, but answer-key check could not run."));
			} finally {
				setChecking(false);
			}
		} catch (err) {
			toast.error(friendlyRpcError(err, "Save failed."));
		} finally {
			setPending(false);
		}
	}
	async function checkKey() {
		if (!validateForm()) return;
		setChecking(true);
		try {
			const next = await validateAnswerKey({ data: payload() });
			setReport(next);
			toast.success(next.summary);
		} catch (err) {
			toast.error(friendlyRpcError(err, "Could not check the answer key."));
		} finally {
			setChecking(false);
		}
	}
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoordShell, {
		active: "questions",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading question…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CoordShell, {
		active: "questions",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/coordinator/questions",
				className: "inline-flex items-center gap-1 text-xs text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Back to question bank"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: isNew ? "Add question" : "Edit question & answer key"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Participants only see the description and buggy code. The correct program, expected corrections, and marks stay coordinator-only."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => void checkKey(),
						disabled: pending || checking,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), checking ? "Checking…" : "Check answer key"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void save(),
						disabled: pending || checking,
						children: pending ? "Saving…" : "Save question & answers"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Shown to participants"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Debug the Stack Implementation"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Language" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm",
									value: language,
									onChange: (e) => setLanguage(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "python",
										children: "Python"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "c",
										children: "C"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Competition slot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm",
									value: selectedSlot ?? "",
									onChange: (e) => setSelectedSlot(e.target.value ? Number(e.target.value) : null),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Not selected"
									}), [
										1,
										2,
										3,
										4,
										5,
										6
									].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: n,
										children: ["Question ", n]
									}, n))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-end gap-2 pb-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isActive,
									onChange: (e) => setIsActive(e.target.checked)
								}), "Active in bank"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description shown to participants" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "font-sans",
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "What the program is supposed to do after the bugs are fixed."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Buggy code (starting program)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-72 overflow-hidden rounded-[var(--radius-sm)] border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeEditor, {
								language,
								value: buggyCode,
								onChange: setBuggyCode
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Answer key — coordinator only"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Paste the fully corrected program here. It is used for winner verification and is never sent to participant browsers."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-80 overflow-hidden rounded-[var(--radius-sm)] border border-primary/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeEditor, {
						language,
						value: correctCode,
						onChange: setCorrectCode
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Errors, expected fixes, and marks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Each row is one awardable correction. If the submitted code matches the validation rule, those marks are added. Nothing is ever deducted."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setErrors((prev) => [...prev, emptyError()]),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Add error"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-3",
					children: errors.map((err, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-md)] border border-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 text-xs uppercase tracking-[0.12em] text-muted",
								children: ["Error ", String(i + 1).padStart(2, "0")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Type",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm",
											value: err.errorType,
											onChange: (e) => updateError(i, { errorType: e.target.value }),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "syntax",
												children: "Syntax"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "logic",
												children: "Logic"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Marks",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 0,
											max: 50,
											value: err.marks,
											onChange: (e) => updateError(i, { marks: Number(e.target.value) })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Location",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: err.location,
											onChange: (e) => updateError(i, { location: e.target.value }),
											placeholder: "line 4 / first loop"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-end justify-between gap-2 pb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: err.isActive,
												onChange: (e) => updateError(i, { isActive: e.target.checked })
											}), "Active"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => removeError(i),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Description",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: err.description,
											onChange: (e) => updateError(i, { description: e.target.value }),
											placeholder: "Missing semicolon after the array declaration"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Expected correction (hidden from participants)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: err.expectedCorrection,
											onChange: (e) => updateError(i, { expectedCorrection: e.target.value }),
											placeholder: "int a[6] = {12, 25, 18, 30, 15, 20};"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-3 sm:grid-cols-[10rem_1fr]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Validation",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm",
												value: err.ruleType,
												onChange: (e) => updateError(i, { ruleType: e.target.value }),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "contains",
														children: "Contains"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "not_contains",
														children: "Not contains"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "regex",
														children: "Regex"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "json",
														children: "Advanced JSON"
													})
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: err.ruleType === "json" ? "Compound rule JSON" : "Pattern / text that means this error is fixed",
											children: err.ruleType === "json" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												className: "min-h-24",
												value: err.ruleValue,
												onChange: (e) => updateError(i, { ruleValue: e.target.value })
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "font-mono",
												value: err.ruleValue,
												onChange: (e) => updateError(i, { ruleValue: e.target.value }),
												placeholder: err.ruleType === "regex" ? "sum\\s*\\+=\\s*a\\s*\\[" : "class Stack"
											})
										})]
									})
								]
							})
						]
					}, err.id ?? `new-${i}`))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Test cases"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Optional. Used when a participant runs or submits code. Hidden tests are not shown in the exam."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setTests((prev) => [...prev, {
							visibility: "visible",
							stdin: "",
							expectedStdout: ""
						}]),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Add test"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-3",
					children: tests.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-md)] border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-10 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-2 text-sm",
								value: t.visibility,
								onChange: (e) => updateTest(i, { visibility: e.target.value }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "visible",
									children: "Visible"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "hidden",
									children: "Hidden"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => removeTest(i),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "stdin",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: t.stdin,
									onChange: (e) => updateTest(i, { stdin: e.target.value })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Expected stdout",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: t.expectedStdout,
									onChange: (e) => updateTest(i, { expectedStdout: e.target.value })
								})
							})]
						})]
					}, t.id ?? `t-${i}`))
				})]
			}),
			report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Answer key check"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: report.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2",
						children: report.errorChecks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-[var(--radius-sm)] border px-3 py-2 text-sm ${c.healthy ? "border-success/30 bg-success/10" : "border-warn/30 bg-warn/10"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-medium",
								children: [
									c.healthy ? "Ready" : "Needs attention",
									" · ",
									c.description,
									" · ",
									c.marks,
									" marks"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: c.hint
							})]
						}, c.id))
					}),
					report.execution.compileOutput ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg p-3 font-mono text-xs text-muted",
						children: report.execution.compileOutput
					}) : null,
					report.execution.tests.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-1 text-xs",
						children: report.execution.tests.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: t.passed ? "text-success" : "text-danger",
							children: [
								t.passed ? "PASS" : "FAIL",
								" · expected ",
								JSON.stringify(t.expected),
								" · got",
								" ",
								JSON.stringify(t.actual)
							]
						}, t.id))
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-4 mt-8 flex flex-wrap justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => void checkKey(),
					disabled: pending || checking,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), checking ? "Checking…" : "Check answer key"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void save(),
					disabled: pending || checking,
					size: "lg",
					children: pending ? "Saving…" : "Save question & answers"
				})]
			})
		]
	});
	function updateError(index, patch) {
		setErrors((prev) => prev.map((e, i) => i === index ? {
			...e,
			...patch
		} : e));
	}
	function removeError(index) {
		setErrors((prev) => prev.filter((_, i) => i !== index));
	}
	function updateTest(index, patch) {
		setTests((prev) => prev.map((t, i) => i === index ? {
			...t,
			...patch
		} : t));
	}
	function removeTest(index) {
		setTests((prev) => prev.filter((_, i) => i !== index));
	}
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { QuestionEditorPage as component };
