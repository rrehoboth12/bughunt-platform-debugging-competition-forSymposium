import "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./button-DV9-6TbT.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-primary/30 bg-primary/10 text-primary",
		muted: "border-border bg-bg-subtle text-muted",
		success: "border-success/30 bg-success/10 text-success",
		warn: "border-warn/30 bg-warn/10 text-warn",
		danger: "border-danger/30 bg-danger/10 text-danger",
		partial: "border-partial/30 bg-partial/10 text-partial",
		python: "border-info/30 bg-info/10 text-info",
		c: "border-primary/30 bg-primary/10 text-primary"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
