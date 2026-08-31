import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-DV9-6TbT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-DvFXc0fu.js
var import_jsx_runtime = require_jsx_runtime();
function BrandMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-3", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative grid size-9 place-items-center rounded-[var(--radius-sm)] border border-primary/50 bg-primary/10 glow-cyan",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs font-semibold tracking-widest text-primary",
				children: "BH"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-sm font-semibold tracking-wide",
				children: "MIRAI"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-[0.18em] text-muted",
				children: "Bug Hunt"
			})]
		})]
	});
}
function GridBackdrop() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			style: {
				backgroundImage: "linear-gradient(to right, color-mix(in oklab, var(--color-primary) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-primary) 10%, transparent) 1px, transparent 1px)",
				backgroundSize: "48px 48px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-primary)_16%,transparent)_0%,var(--color-bg)_70%)]" })]
	});
}
//#endregion
export { GridBackdrop as n, BrandMark as t };
