import getSummaryRow, { getObject as getSummaryObject } from "./summaryRow/v3/index.js";
import getBalanceRow from "./balanceRow/v1/index.js";

/**
 * Footer Module (v2): Pure function returning <tfoot> <tr> row specs array or null
 */
export const buildFooter = ({
    inFooterConfig,
    inHasFooterConfig,
    inColumns,
    inData,
    inTrSpec,
    inThSpec
}) => {
    const localFooterConfig = inFooterConfig;
    const localHasFooterConfig = inHasFooterConfig;
    const localColumns = inColumns;
    const localData = inData;
    const localTrSpec = inTrSpec;
    const localThSpec = inThSpec;

    if (!localHasFooterConfig || !localFooterConfig || typeof localFooterConfig !== "object") {
        return null;
    }

    const footerRows = [];
    let summaryRowObject = {};
    debugger;
    // Process summaryRow configuration via v3 module (Two-phase data-object architecture)
    if (localFooterConfig.summaryRow && typeof localFooterConfig.summaryRow === "object") {
        summaryRowObject = getSummaryObject({
            inSummaryConfig: localFooterConfig.summaryRow,
            inColumns: localColumns,
            inData: localData
        });

        const summaryRowSpec = getSummaryRow({
            inSummaryConfig: localFooterConfig.summaryRow,
            inColumns: localColumns,
            inData: localData,
            inTrSpec: localTrSpec,
            inThSpec: localThSpec
        });

        if (summaryRowSpec) {
            footerRows.push(summaryRowSpec);
        }
    };

    if (localFooterConfig.balanceRow && typeof localFooterConfig.balanceRow === "object") {
        const balanceRowSpec = getBalanceRow({
            inBalanceConfig: localFooterConfig.balanceRow,
            inColumns: localColumns,
            inData: localData,
            inTrSpec: localTrSpec,
            inThSpec: localThSpec,
            inSummaryRowObject: summaryRowObject
        });
        if (balanceRowSpec) {
            footerRows.push(balanceRowSpec);
        };
    };

    return footerRows;
};

export default buildFooter;

