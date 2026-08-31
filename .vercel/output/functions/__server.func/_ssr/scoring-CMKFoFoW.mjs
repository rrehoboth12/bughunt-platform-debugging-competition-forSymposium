//#region node_modules/.nitro/vite/services/ssr/assets/scoring-CMKFoFoW.js
function parseRule(raw) {
	if (!raw || typeof raw !== "object") return {
		type: "contains",
		value: ""
	};
	const obj = raw;
	if (obj.type === "contains" || obj.type === "not_contains") return {
		type: obj.type,
		value: String(obj.value ?? ""),
		caseSensitive: Boolean(obj.caseSensitive)
	};
	if (obj.type === "regex") return {
		type: "regex",
		pattern: String(obj.pattern ?? ""),
		flags: String(obj.flags ?? "")
	};
	if (obj.type === "all" || obj.type === "any") {
		const rules = Array.isArray(obj.rules) ? obj.rules.map(parseRule) : [];
		return {
			type: obj.type,
			rules
		};
	}
	return {
		type: "contains",
		value: ""
	};
}
function rulePasses(code, rule) {
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
		case "regex": try {
			return new RegExp(rule.pattern, rule.flags || "").test(code);
		} catch {
			return false;
		}
		case "all": return rule.rules.every((r) => rulePasses(code, r));
		case "any": return rule.rules.some((r) => rulePasses(code, r));
		default: return false;
	}
}
function evaluateErrors(code, errors) {
	const active = errors.filter((e) => e.isActive);
	const fixed = [];
	const unfixed = [];
	for (const error of active) if (rulePasses(code, error.validationRule)) fixed.push(error);
	else unfixed.push(error);
	return {
		fixed,
		unfixed,
		marks: fixed.reduce((sum, e) => sum + e.marks, 0)
	};
}
function unionFixedIds(previous, next) {
	return Array.from(/* @__PURE__ */ new Set([...previous, ...next]));
}
function marksFromFixed(errors, fixedIds) {
	const set = new Set(fixedIds);
	return errors.filter((e) => e.isActive && set.has(e.id)).reduce((sum, e) => sum + e.marks, 0);
}
function answerStatus(bestMarks, maxMarks, attempted) {
	if (!attempted && bestMarks <= 0) return "not_attempted";
	if (maxMarks > 0 && bestMarks >= maxMarks) return "correct";
	if (bestMarks > 0) return "partial";
	return "attempted";
}
function maxMarksOf(errors) {
	return errors.filter((e) => e.isActive).reduce((sum, e) => sum + e.marks, 0);
}
function normalizeStdout(text) {
	return text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
}
//#endregion
export { normalizeStdout as a, unionFixedIds as c, maxMarksOf as i, evaluateErrors as n, parseRule as o, marksFromFixed as r, rulePasses as s, answerStatus as t };
