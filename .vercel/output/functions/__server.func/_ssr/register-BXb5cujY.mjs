import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-DV9-6TbT.mjs";
import { n as GridBackdrop, t as BrandMark } from "./brand-DvFXc0fu.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CcktAedr.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getMe, k as updateDetails, y as registerParticipant } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-DtbU2b2C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-BXb5cujY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var YEARS = [
	"I",
	"II",
	"III",
	"IV",
	"PG"
];
function RegisterPage() {
	const navigate = useNavigate();
	const [pending, setPending] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		department: "Artificial Intelligence and Data Science",
		year: "III",
		email: "",
		phone: "",
		college: "Arunachala College of Engineering for Women",
		participationCode: ""
	});
	(0, import_react.useEffect)(() => {
		getMe().then((me) => {
			if (me.role === "coordinator") {
				navigate({ to: "/coordinator/dashboard" });
				return;
			}
			if (me.role !== "participant") return;
			if (me.participant.status === "in_progress") {
				navigate({ to: "/exam" });
				return;
			}
			if (me.participant.status === "submitted" || me.participant.status === "terminated") {
				navigate({ to: "/result" });
				return;
			}
			if (me.participant.status === "confirmed") {
				navigate({ to: "/rules" });
				return;
			}
			setEditing(true);
			setForm((prev) => ({
				...prev,
				fullName: me.participant.fullName,
				department: me.participant.department,
				year: me.participant.year,
				email: me.participant.email,
				phone: me.participant.phone,
				college: me.participant.college
			}));
		});
	}, [navigate]);
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		try {
			if (editing) {
				await updateDetails({ data: {
					fullName: form.fullName,
					department: form.department,
					year: form.year,
					email: form.email,
					phone: form.phone,
					college: form.college
				} });
				await navigate({ to: "/confirm" });
			} else {
				if ((await registerParticipant({ data: form })).kind === "coordinator") {
					await navigate({ to: "/coordinator/dashboard" });
					return;
				}
				await navigate({ to: "/confirm" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Registration failed.");
		} finally {
			setPending(false);
		}
	}
	function set(key, value) {
		setForm((prev) => ({
			...prev,
			[key]: value
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridBackdrop, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-xl px-5 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-xs text-muted hover:text-fg",
					children: "Back"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "glow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Participant registration" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Enter your details and the access code issued by the coordinators. Staff access is resolved on the server — never enter a staff code into local checks." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-4",
					onSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.fullName,
								onChange: (e) => set("fullName", e.target.value),
								autoComplete: "name"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Department",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.department,
									onChange: (e) => set("department", e.target.value),
									placeholder: "AI & DS"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Year",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "flex h-11 w-full rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm",
									value: form.year,
									onChange: (e) => set("year", e.target.value),
									children: YEARS.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: y,
										children: y
									}, y))
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email ID",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: form.email,
								onChange: (e) => set("email", e.target.value),
								autoComplete: "email"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.phone,
								onChange: (e) => set("phone", e.target.value),
								autoComplete: "tel"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "College name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.college,
								onChange: (e) => set("college", e.target.value)
							})
						}),
						editing ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Access code",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: form.participationCode,
								onChange: (e) => set("participationCode", e.target.value),
								autoComplete: "off",
								className: "font-mono tracking-wide"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "mt-2",
							disabled: pending,
							children: pending ? "Validating…" : "Continue"
						})
					]
				}) })]
			})]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { RegisterPage as component };
