import calculateAggregate from "./aggregateFunctions.js";

/**
 * Step 1: Generates key-value data object of balance values for each column
 * Output format: { [columnKey]: "value", ... }
 */
export const getObject = ({ inBalanceConfig, inColumns, inData, inSummaryRowObject }) => {
    const localBalanceConfig = inBalanceConfig || {};
    const localColumns = inColumns || [];
    const localData = inData || [];
    const localSummaryRowObject = inSummaryRowObject || {};

    const balanceDataObject = {};

    localColumns.forEach(columnKey => {
        const keyName = typeof columnKey === "object"
            ? (columnKey.field || columnKey.name || columnKey.label)
            : columnKey;

        const funcType = localBalanceConfig[keyName];

        balanceDataObject[keyName] = calculateAggregate({
            inData: localData,
            inColumnKey: keyName,
            inFuncType: funcType,
            inSummaryRowObject: localSummaryRowObject
        });
    });

    return balanceDataObject;
};

export default getObject;
