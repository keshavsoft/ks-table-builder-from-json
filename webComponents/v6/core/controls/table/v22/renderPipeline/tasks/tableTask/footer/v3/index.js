import { getObject as getSummaryObject } from "./summaryRow/index.js";
import { getObject as getBalanceObject } from "./balanceRow/index.js";
import buildFooterRowSpec from "./buildFooterRowSpec.js";

/**
 * Footer Module (v3): Fully self-contained Two-step Pipeline
 * Step 1: Arrive at ALL footer row data objects first (summaryRowObject, balanceRowObject, etc.)
 * Step 2: Loop through data objects array and render each on-the-fly into <tr> row specs
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

    // STEP 1: Arrive at ALL footer row data objects first
    const footerDataObjects = [];

    // 1a. Calculate summaryRow data object
    if (localFooterConfig.summaryRow && typeof localFooterConfig.summaryRow === "object") {
        const summaryRowObject = getSummaryObject({
            inSummaryConfig: localFooterConfig.summaryRow,
            inColumns: localColumns,
            inData: localData
        });
        if (summaryRowObject) {
            footerDataObjects.push(summaryRowObject);
        }
    }

    // 1b. Calculate balanceRow data object (relies purely on summaryRow data object)
    if (localFooterConfig.balanceRow && typeof localFooterConfig.balanceRow === "object") {
        const summaryRowObject = footerDataObjects[0] || {};
        const balanceRowObject = getBalanceObject({
            inBalanceConfig: localFooterConfig.balanceRow,
            inColumns: localColumns,
            inSummaryRowObject: summaryRowObject
        });
        if (balanceRowObject) {
            footerDataObjects.push(balanceRowObject);
        }
    }

    // STEP 2: Loop through footer data objects array and render row specs on the fly
    const footerRows = footerDataObjects.map(dataObj => {
        return buildFooterRowSpec({
            inDataObject: dataObj,
            inColumns: localColumns,
            inTrSpec: localTrSpec,
            inThSpec: localThSpec
        });
    }).filter(Boolean);

    return footerRows;
};

export default buildFooter;
