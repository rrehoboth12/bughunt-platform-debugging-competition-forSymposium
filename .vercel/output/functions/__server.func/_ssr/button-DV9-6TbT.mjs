import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, v as Slot, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DV9-6TbT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatDuration(ms) {
	if (ms == null || !Number.isFinite(ms) || ms < 0) return "—";
	const total = Math.floor(ms / 1e3);
	const h = Math.floor(total / 3600);
	const m = Math.floor(total % 3600 / 60);
	const s = total % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function formatClock(totalSeconds) {
	const clamped = Math.max(0, Math.floor(totalSeconds));
	const m = Math.floor(clamped / 60);
	const s = clamped % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function rankLabel(rank) {
	if (rank === 1) return "1st";
	if (rank === 2) return "2nd";
	if (rank === 3) return "3rd";
	return `${rank}th`;
}
function friendlyRpcError(err, fallback) {
	const raw = err instanceof Error ? err.message : String(err ?? "");
	if (/content-type|invariant failed/i.test(raw)) return "The save did not complete. Try again. If it keeps failing, shorten the code or split a long error list.";
	if (/failed to fetch|networkerror|load failed|fetch/i.test(raw)) return "Network error. Check the connection and try again.";
	if (/Coordinator access required/i.test(raw)) return "Coordinator session expired. Open Coordinator access and enter the code again.";
	if (/Participant session required/i.test(raw)) return "Your exam session expired. Register again with your participation code.";
	if (raw && raw.length > 0 && raw.length < 280 && !raw.includes("    at ")) return raw;
	return fallback;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-[opacity,transform,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-bg-subtle text-fg border border-border hover:border-border-strong",
			outline: "border border-border bg-transparent text-fg hover:bg-bg-subtle",
			ghost: "text-fg hover:bg-bg-subtle",
			danger: "bg-danger text-bg hover:opacity-90",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-6",
			icon: "h-11 w-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { formatDuration as a, formatClock as i, buttonVariants as n, friendlyRpcError as o, cn as r, rankLabel as s, Button as t };
