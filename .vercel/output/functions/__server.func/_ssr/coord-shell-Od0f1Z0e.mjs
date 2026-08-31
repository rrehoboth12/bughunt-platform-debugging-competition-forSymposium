import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-DV9-6TbT.mjs";
import { t as BrandMark } from "./brand-DvFXc0fu.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getMe, v as logoutSession } from "./fns-BKGjYtEO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coord-shell-Od0f1Z0e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/coordinator/questions",
		label: "Question bank",
		key: "questions"
	},
	{
		to: "/coordinator/dashboard",
		label: "Results",
		key: "results"
	},
	{
		to: "/coordinator/settings",
		label: "Settings",
		key: "settings"
	}
];
function CoordShell({ children, active }) {
	const navigate = useNavigate();
	const [ok, setOk] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getMe().then((me) => {
			if (me.role !== "coordinator") {
				navigate({ to: "/coordinator" });
				return;
			}
			setOk(true);
		});
	}, [navigate]);
	if (!ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center text-muted",
		children: "Checking access…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-wrap gap-1 sm:ml-6",
					children: LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: cn("rounded-[var(--radius-sm)] px-3 py-2 text-sm", active === "questions" && l.key === "questions" || active === "results" && l.key === "results" || active === "review" && l.key === "results" || active === "settings" && l.key === "settings" ? "bg-bg-subtle text-fg" : "text-muted hover:text-fg"),
						children: l.label
					}, l.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => void logoutSession().then(() => navigate({ to: "/coordinator" })),
					children: "Sign out"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-4 py-6",
			children
		})]
	});
}
//#endregion
export { CoordShell as t };
