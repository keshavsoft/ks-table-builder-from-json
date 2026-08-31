/**
 * Helper: Evaluates formula expression (e.g. "Credit-Debit", "Credit - Debit") on summaryRowObject
 */
const evaluateFormula = ({ inFormula, inSummaryRowObject }) => {
    const localFormula = inFormula;
    const localSummaryRowObject = inSummaryRowObject || {};

    if (!localFormula) return null;

    // 1. Check for binary operators (-, +, *, /)
    const operators = ["-", "+", "*", "/"];
    for (const op of operators) {
        if (localFormula.includes(op)) {
            const parts = localFormula.split(op).map(p => p.trim());
            if (parts.length === 2) {
                const [leftKey, rightKey] = parts;
                const hasLeft = localSummaryRowObject[leftKey] !== undefined;
                const hasRight = localSummaryRowObject[rightKey] !== undefined;

                if (hasLeft || hasRight || !isNaN(Number(leftKey)) || !isNaN(Number(rightKey))) {
                    const leftVal = hasLeft ? Number(localSummaryRowObject[leftKey]) : Number(leftKey);
                    const rightVal = hasRight ? Number(localSummaryRowObject[rightKey]) : Number(rightKey);

                    if (!isNaN(leftVal) && !isNaN(rightVal)) {
                        let res = 0;
                        if (op === "-") res = leftVal - rightVal;
                        else if (op === "+") res = leftVal + rightVal;
                        else if (op === "*") res = leftVal * rightVal;
                        else if (op === "/") res = rightVal !== 0 ? leftVal / rightVal : 0;

                        return String(res);
                    }
                }
            }
        }
    }

    // 2. Direct key match in localSummaryRowObject
    if (localSummaryRowObject[localFormula] !== undefined) {
        return String(localSummaryRowObject[localFormula]);
    }

    return null;
};

/**
 * Utility: Evaluates balance row values either via summaryRowObject formula evaluation or dataset aggregate
 */
export const calculateAggregate = ({ inData, inColumnKey, inFuncType, inSummaryRowObject }) => {
    const localData = inData || [];
    const localColumnKey = inColumnKey;
    const rawFuncType = typeof inFuncType === "string" ? inFuncType.trim() : String(inFuncType || "");
    const localSummaryRowObject = inSummaryRowObject || {};

    if (!rawFuncType) {
        return typeof inFuncType === "number" || typeof inFuncType === "string" ? String(inFuncType) : "";
    }

    // First: Evaluate formula against summaryRowObject if available
    const formulaResult = evaluateFormula({
        inFormula: rawFuncType,
        inSummaryRowObject: localSummaryRowObject
    });

    if (formulaResult !== null) {
        return formulaResult;
    }

    // Second: Fallback if localSummaryRowObject already has direct column value
    if (localSummaryRowObject[localColumnKey] !== undefined && (rawFuncType.toLowerCase() === "count" || rawFuncType.toLowerCase() === "sum" || rawFuncType.toLowerCase() === "min" || rawFuncType.toLowerCase() === "max" || rawFuncType.toLowerCase() === "avg")) {
        return String(localSummaryRowObject[localColumnKey]);
    }

    // Third: Fallback to dataset aggregate calculation
    const localFuncType = rawFuncType.toLowerCase();

    if (localFuncType === "count") {
        return String(localData.length);
    }

    const numericValues = localData
        .map(row => Number(row[localColumnKey]))
        .filter(val => !isNaN(val));

    if (numericValues.length === 0) {
        return "0";
    }

    if (localFuncType === "sum") {
        const sum = numericValues.reduce((acc, val) => acc + val, 0);
        return String(sum);
    }

    if (localFuncType === "avg" || localFuncType === "mean") {
        const sum = numericValues.reduce((acc, val) => acc + val, 0);
        const avg = sum / numericValues.length;
        return String(Math.round(avg * 100) / 100);
    }

    if (localFuncType === "min") {
        return String(Math.min(...numericValues));
    }

    if (localFuncType === "max") {
        return String(Math.max(...numericValues));
    }

    return String(inFuncType);
};

export default calculateAggregate;
