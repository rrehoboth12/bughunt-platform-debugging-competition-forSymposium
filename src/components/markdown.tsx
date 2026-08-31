import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="rounded-[4px] bg-bg-subtle px-1 font-mono text-[0.9em] text-primary"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let fence: string[] | null = null;

  function flushPara() {
    if (!para.length) return;
    nodes.push(
      <p key={i++} className="text-sm leading-relaxed text-muted">
        {inline(para.join(" "))}
      </p>,
    );
    para = [];
  }

  function flushList() {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    nodes.push(
      <Tag
        key={i++}
        className={cn(
          "my-1 space-y-1 pl-5 text-sm text-muted",
          list.ordered ? "list-decimal" : "list-disc",
        )}
      >
        {list.items.map((item, idx) => (
          <li key={idx}>{inline(item)}</li>
        ))}
      </Tag>,
    );
    list = null;
  }

  for (const line of lines) {
    if (fence) {
      if (line.startsWith("```")) {
        nodes.push(
          <pre
            key={i++}
            className="my-2 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg-subtle p-3 font-mono text-[12px] leading-relaxed text-fg"
          >
            {fence.join("\n")}
          </pre>,
        );
        fence = null;
      } else {
        fence.push(line);
      }
      continue;
    }
    if (line.startsWith("```")) {
      flushPara();
      flushList();
      fence = [];
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushPara();
      flushList();
      const level = heading[1].length;
      const cls =
        level === 1
          ? "font-display text-lg font-semibold text-fg"
          : level === 2
            ? "font-display text-base font-semibold text-fg"
            : "text-sm font-semibold text-fg";
      nodes.push(
        <div key={i++} className={cn("mt-3 first:mt-0", cls)}>
          {inline(heading[2])}
        </div>,
      );
      continue;
    }
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      flushPara();
      const ordered = Boolean(ol);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((ul?.[1] ?? ol?.[1]) ?? "");
      continue;
    }
    if (line.trim() === "") {
      flushPara();
      flushList();
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  if (fence) {
    nodes.push(
      <pre
        key={i++}
        className="my-2 overflow-auto rounded-[var(--radius-sm)] border border-border bg-bg-subtle p-3 font-mono text-[12px] text-fg"
      >
        {fence.join("\n")}
      </pre>,
    );
  }

  return <div className={cn("grid gap-2", className)}>{nodes}</div>;
}
