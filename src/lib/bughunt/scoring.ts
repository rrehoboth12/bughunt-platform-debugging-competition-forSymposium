import type {
  AnswerStatus,
  QuestionError,
  ValidationRule,
} from "./types";

export function parseRule(raw: unknown): ValidationRule {
  if (!raw || typeof raw !== "object") {
    return { type: "contains", value: "" };
  }
  const obj = raw as ValidationRule;
  if (obj.type === "contains" || obj.type === "not_contains") {
    return {
      type: obj.type,
      value: String((obj as { value?: unknown }).value ?? ""),
      caseSensitive: Boolean((obj as { caseSensitive?: unknown }).caseSensitive),
    };
  }
  if (obj.type === "regex") {
    return {
      type: "regex",
      pattern: String((obj as { pattern?: unknown }).pattern ?? ""),
      flags: String((obj as { flags?: unknown }).flags ?? ""),
    };
  }
  if (obj.type === "all" || obj.type === "any") {
    const rules = Array.isArray((obj as { rules?: unknown }).rules)
      ? ((obj as { rules: unknown[] }).rules).map(parseRule)
      : [];
    return { type: obj.type, rules };
  }
  return { type: "contains", value: "" };
}

export function rulePasses(code: string, rule: ValidationRule): boolean {
  switch (rule.type) {
    case "contains": {
      if (!rule.value) return false;
      const hay = rule.caseSensitive ? code : code.toLowerCase();
      const needle = rule.caseSensitive ? rule.value : rule.value.toLowerCase();
      return hay.includes(needle);
    }
    case "not_contains": {
      if (!rule.value) return true;
      const hay = rule.caseSensitive ? code : code.toLowerCase();
      const needle = rule.caseSensitive ? rule.value : rule.value.toLowerCase();
      return !hay.includes(needle);
    }
    case "regex": {
      try {
        const re = new RegExp(rule.pattern, rule.flags || "");
        return re.test(code);
      } catch {
        return false;
      }
    }
    case "all":
      return rule.rules.every((r) => rulePasses(code, r));
    case "any":
      return rule.rules.some((r) => rulePasses(code, r));
    default:
      return false;
  }
}

export function evaluateErrors(
  code: string,
  errors: QuestionError[],
): {
  fixed: QuestionError[];
  unfixed: QuestionError[];
  marks: number;
} {
  const active = errors.filter((e) => e.isActive);
  const fixed: QuestionError[] = [];
  const unfixed: QuestionError[] = [];
  for (const error of active) {
    if (rulePasses(code, error.validationRule)) fixed.push(error);
    else unfixed.push(error);
  }
  const marks = fixed.reduce((sum, e) => sum + e.marks, 0);
  return { fixed, unfixed, marks };
}

export function unionFixedIds(previous: string[], next: string[]): string[] {
  return Array.from(new Set([...previous, ...next]));
}

export function marksFromFixed(
  errors: QuestionError[],
  fixedIds: string[],
): number {
  const set = new Set(fixedIds);
  return errors
    .filter((e) => e.isActive && set.has(e.id))
    .reduce((sum, e) => sum + e.marks, 0);
}

export function answerStatus(
  bestMarks: number,
  maxMarks: number,
  attempted: boolean,
): AnswerStatus {
  if (!attempted && bestMarks <= 0) return "not_attempted";
  if (maxMarks > 0 && bestMarks >= maxMarks) return "correct";
  if (bestMarks > 0) return "partial";
  return "attempted";
}

export function maxMarksOf(errors: QuestionError[]): number {
  return errors.filter((e) => e.isActive).reduce((sum, e) => sum + e.marks, 0);
}

export function normalizeStdout(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
}
