import calculateAggregate from "./aggregateFunctions.js";

/**
 * Helper: Generates individual <th> balance cell spec for a column
 */
export const getTh = ({ inColumnKey, inFuncType, inData, inThSpec, inSummaryRowObject }) => {
    const localColumnKey = inColumnKey;
    const localFuncType = inFuncType;
    const localData = inData || [];
    const localThSpec = inThSpec;
    const localSummaryRowObject = inSummaryRowObject || {};

    const cellText = calculateAggregate({
        inData: localData,
        inColumnKey: localColumnKey,
        inFuncType: localFuncType,
        inSummaryRowObject: localSummaryRowObject
    });

    const thNode = JSON.parse(JSON.stringify(localThSpec));
    thNode.textContent = cellText;

    return thNode;
};

export default getTh;

