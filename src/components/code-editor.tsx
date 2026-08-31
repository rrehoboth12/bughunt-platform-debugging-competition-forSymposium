import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import type { Language } from "@/lib/bughunt/types";

const chrome = EditorView.theme(
  {
    "&": {
      backgroundColor: "#07080c",
      fontSize: "13.5px",
      height: "100%",
    },
    ".cm-content": {
      fontFamily:
        '"JetBrains Mono", "Fira Code", "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
      caretColor: "#0ea5e9",
      padding: "12px 0",
    },
    ".cm-gutters": {
      backgroundColor: "#07080c",
      color: "#5c6370",
      border: "none",
    },
    ".cm-activeLine": { backgroundColor: "rgba(14, 165, 233, 0.07)" },
    ".cm-activeLineGutter": { backgroundColor: "transparent", color: "#0ea5e9" },
    ".cm-cursor": { borderLeftColor: "#0ea5e9" },
    ".cm-scroller": { overflow: "auto" },
  },
  { dark: true },
);

export function CodeEditor({
  language,
  value,
  onChange,
  readOnly,
}: {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return (
      <textarea
        className="h-full min-h-64 w-full resize-none bg-bg p-3 font-mono text-sm text-fg outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
      />
    );
  }
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={oneDark}
      extensions={[
        chrome,
        language === "python" ? python() : cpp(),
        EditorView.lineWrapping,
      ]}
      onChange={onChange}
      readOnly={readOnly}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: false,
        searchKeymap: false,
      }}
    />
  );
}
