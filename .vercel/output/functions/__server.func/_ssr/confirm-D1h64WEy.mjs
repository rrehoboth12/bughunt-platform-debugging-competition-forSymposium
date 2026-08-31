import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-DV9-6TbT.mjs";
import { n as GridBackdrop, t as BrandMark } from "./brand-DvFXc0fu.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CcktAedr.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as getMe, t as confirmDetails } from "./fns-BKGjYtEO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confirm-D1h64WEy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConfirmPage() {
	const navigate = useNavigate();
	const [participant, setParticipant] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getMe().then((me) => {
			if (me.role !== "participant") {
				navigate({ to: "/register" });
				return;
			}
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
			setParticipant(me.participant);
		});
	}, [navigate]);
	async function confirm() {
		setPending(true);
		try {
			await confirmDetails();
			await navigate({ to: "/rules" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not confirm details.");
		} finally {
			setPending(false);
		}
	}
	if (!participant) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center text-muted",
		children: "Loading…"
	});
	const rows = [
		["Full name", participant.fullName],
		["Department", participant.department],
		["Year", participant.year],
		["Email ID", participant.email],
		["Phone number", participant.phone],
		["College name", participant.college]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridBackdrop, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-xl px-5 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-8 glow-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Verify your details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Please verify your details before starting BUG HUNT." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "divide-y divide-border rounded-[var(--radius-md)] border border-border",
					children: rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[8.5rem_1fr] gap-3 px-4 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: v
						})]
					}, k))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							children: "EDIT DETAILS"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-0 flex-1",
						onClick: () => void confirm(),
						disabled: pending,
						children: pending ? "Saving…" : "CONFIRM DETAILS"
					})]
				})] })]
			})]
		})]
	});
}
//#endregion
export { ConfirmPage as component };
