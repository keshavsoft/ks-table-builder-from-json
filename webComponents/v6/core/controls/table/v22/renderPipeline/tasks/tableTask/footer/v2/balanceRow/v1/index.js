import getObject from "./getObject.js";
import getRow from "./getRow.js";

/**
 * Balance Row Module (v1): Self-contained balance row calculator
 */
export const getBalanceRow = ({ inBalanceConfig, inColumns, inData, inTrSpec, inThSpec, inSummaryRowObject }) => {
    const localBalanceConfig = inBalanceConfig;
    const localColumns = inColumns || [];
    const localData = inData || [];
    const localTrSpec = inTrSpec;
    const localThSpec = inThSpec;
    const localSummaryRowObject = inSummaryRowObject || {};

    if (!localBalanceConfig || typeof localBalanceConfig !== "object") {
        return null;
    }

    const balanceDataObject = getObject({
        inBalanceConfig: localBalanceConfig,
        inColumns: localColumns,
        inData: localData,
        inSummaryRowObject: localSummaryRowObject
    });

    if (!localTrSpec || !localThSpec) {
        return balanceDataObject;
    }

    return getRow({
        inConfig: localBalanceConfig,
        inColumns: localColumns,
        inData: localData,
        inTrSpec: localTrSpec,
        inThSpec: localThSpec,
        inSummaryRowObject: localSummaryRowObject
    });
};

export { getObject, getRow };
export default getBalanceRow;
