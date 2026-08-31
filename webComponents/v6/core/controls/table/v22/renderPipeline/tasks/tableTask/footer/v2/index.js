import buildSummaryRow from "./summaryRow/v2/index.js";

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
    const localColumns = inColumns || [];
    const localData = inData || [];
    const localTrSpec = inTrSpec;
    const localThSpec = inThSpec;

    if (!localHasFooterConfig) {
        return null;
    }

    const footerRows = [];

    // 1. Handle summaryRow configuration via self-contained summaryRow/v1 module
    if (localFooterConfig?.summaryRow && typeof localFooterConfig.summaryRow === "object") {
        const summaryRowSpec = buildSummaryRow({
            inSummaryConfig: localFooterConfig.summaryRow,
            inColumns: localColumns,
            inData: localData,
            inTrSpec: localTrSpec,
            inThSpec: localThSpec
        });
        if (summaryRowSpec) {
            footerRows.push(summaryRowSpec);
        }
    }

    return footerRows;
};

export default buildFooter;
