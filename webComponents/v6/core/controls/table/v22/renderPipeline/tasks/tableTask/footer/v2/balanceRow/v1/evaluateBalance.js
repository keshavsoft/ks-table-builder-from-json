/**
 * Helper: Evaluates balance row expressions (e.g. "Credit-Debit", "Debit-Credit", "StockItemName")
 * purely using values from inSummaryRowObject.
 * Note: Balance row never accepts or operates on raw dataset (inData).
 */
export const evaluateBalance = ({ inColumnKey, inFuncType, inSummaryRowObject }) => {
    const localColumnKey = inColumnKey;
    const localFuncType = typeof inFuncType === "string" ? inFuncType.trim() : String(inFuncType || "");
    const localSummaryRowObject = inSummaryRowObject || {};

    if (!localFuncType) {
        return localSummaryRowObject[localColumnKey] !== undefined
            ? String(localSummaryRowObject[localColumnKey])
            : "";
    }

    // 1. Check for binary arithmetic operators (-, +, *, /)
    const operators = ["-", "+", "*", "/"];
    for (const op of operators) {
        if (localFuncType.includes(op)) {
            const parts = localFuncType.split(op).map(p => p.trim());
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

    // 2. Direct key lookup in localSummaryRowObject (e.g. inFuncType = "StockItemName" or "Credit")
    if (localSummaryRowObject[localFuncType] !== undefined) {
        return String(localSummaryRowObject[localFuncType]);
    }

    // 3. Fallback: check if localSummaryRowObject has value for current column key
    if (localSummaryRowObject[localColumnKey] !== undefined) {
        return String(localSummaryRowObject[localColumnKey]);
    }

    return String(inFuncType);
};

export default evaluateBalance;
