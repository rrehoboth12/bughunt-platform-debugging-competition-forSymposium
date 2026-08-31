import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as friendlyRpcError, t as Button } from "./button-DV9-6TbT.mjs";
import { n as GridBackdrop, t as BrandMark } from "./brand-DvFXc0fu.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CcktAedr.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getMe, n as coordinatorLogin } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-DtbU2b2C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coordinator-B4Z-GHHL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CoordinatorLogin() {
	const navigate = useNavigate();
	const [code, setCode] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getMe().then((me) => {
			if (me.role === "coordinator") navigate({ to: "/coordinator/questions" });
		});
	}, [navigate]);
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		try {
			await coordinatorLogin({ data: { code } });
			await navigate({ to: "/coordinator/questions" });
		} catch (err) {
			toast.error(friendlyRpcError(err, "Access denied."));
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridBackdrop, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-8 glow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Coordinator access" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "This portal is separate from participant registration. Use only the coordinator access code. After sign-in you land on the question bank so you can edit programs and hidden answer keys." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mb-5 list-decimal space-y-2 pl-5 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Enter the coordinator code and open the question bank." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Add or edit six questions: exactly 3 Python and 3 C. Paste the buggy code and the correct answer key, then set marks per error." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Assign slots Q1–Q6, then open the competition in Settings." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Watch Results for ranking, malpractice, and winner audit." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-4",
						onSubmit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Access code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: code,
								onChange: (e) => setCode(e.target.value),
								autoComplete: "off",
								className: "font-mono",
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: pending,
							children: pending ? "Checking…" : "Open question bank"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mt-4 inline-block text-xs text-muted hover:text-fg",
						children: "Back to landing"
					})
				] })]
			})]
		})]
	});
}
//#endregion
export { CoordinatorLogin as component };
