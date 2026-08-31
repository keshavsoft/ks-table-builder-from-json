import getSummaryRow from "./summaryRow/v2/index.js";
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


    if (!localHasFooterConfig || !localFooterConfig || typeof localFooterConfig !== "object") {
        return null;
    }

    const footerRows = [];
    debugger
    // Process summaryRow configuration via self-contained summaryRow/v2 module
    if (localFooterConfig.summaryRow && typeof localFooterConfig.summaryRow === "object") {
        const summaryRowSpec = getSummaryRow({
            inSummaryConfig: localFooterConfig.summaryRow,
            inColumns,
            inData,
            inTrSpec,
            inThSpec
        });
        if (summaryRowSpec) {
            footerRows.push(summaryRowSpec);
        }
    }

    if (localFooterConfig.balanceRow && typeof localFooterConfig.balanceRow === "object") {
        const balanceRowSpec = getBalanceRow({
            inBalanceConfig: localFooterConfig.balanceRow,
            inColumns,
            inData,
            inTrSpec,
            inThSpec
        });
        if (balanceRowSpec) {
            footerRows.push(balanceRowSpec);
        };
    };

    return footerRows;
};

export default buildFooter;
