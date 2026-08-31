import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as getParticipantReview } from "./fns-BKGjYtEO.mjs";
import { t as AuditView } from "./audit-view-l3EJ_xma.mjs";
import { t as CoordShell } from "./coord-shell-Od0f1Z0e.mjs";
import { r as Route$2 } from "./router-BJnnWVit.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/participants._id-D2HWOy_P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReviewPage() {
	const { id } = Route$2.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getParticipantReview({ data: { id } }).then(setData).catch((err) => setError(err instanceof Error ? err.message : "Could not load review."));
	}, [id]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoordShell, {
		active: "review",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-danger",
			children: error
		})
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoordShell, {
		active: "review",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Loading verification record…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CoordShell, {
		active: "review",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/coordinator/dashboard",
			className: "text-xs text-muted hover:text-fg",
			children: "Back to results"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditView, { data })
		})]
	});
}
//#endregion
export { ReviewPage as component };
