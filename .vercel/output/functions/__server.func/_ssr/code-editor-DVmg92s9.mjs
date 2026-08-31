import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { M as EditorView } from "../_libs/@codemirror/autocomplete+[...].mjs";
import { t as cpp } from "../_libs/@codemirror/lang-cpp+[...].mjs";
import { t as python } from "../_libs/@codemirror/lang-python+[...].mjs";
import { t as oneDark } from "../_libs/codemirror__theme-one-dark.mjs";
import { t as ReactCodeMirror } from "../_libs/uiw__react-codemirror.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/code-editor-DVmg92s9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var chrome = EditorView.theme({
	"&": {
		backgroundColor: "#07080c",
		fontSize: "13.5px",
		height: "100%"
	},
	".cm-content": {
		fontFamily: "\"JetBrains Mono\", \"Fira Code\", \"IBM Plex Mono\", ui-monospace, Menlo, Consolas, monospace",
		caretColor: "#0ea5e9",
		padding: "12px 0"
	},
	".cm-gutters": {
		backgroundColor: "#07080c",
		color: "#5c6370",
		border: "none"
	},
	".cm-activeLine": { backgroundColor: "rgba(14, 165, 233, 0.07)" },
	".cm-activeLineGutter": {
		backgroundColor: "transparent",
		color: "#0ea5e9"
	},
	".cm-cursor": { borderLeftColor: "#0ea5e9" },
	".cm-scroller": { overflow: "auto" }
}, { dark: true });
function CodeEditor({ language, value, onChange, readOnly }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: "h-full min-h-64 w-full resize-none bg-bg p-3 font-mono text-sm text-fg outline-none",
		value,
		onChange: (e) => onChange(e.target.value),
		readOnly,
		spellCheck: false
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactCodeMirror, {
		value,
		height: "100%",
		theme: oneDark,
		extensions: [
			chrome,
			language === "python" ? python() : cpp(),
			EditorView.lineWrapping
		],
		onChange,
		readOnly,
		basicSetup: {
			lineNumbers: true,
			foldGutter: false,
			highlightActiveLine: true,
			autocompletion: false,
			searchKeymap: false
		}
	});
}
//#endregion
export { CodeEditor as t };
