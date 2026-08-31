import collectFooterDataObjects from "./collectFooterDataObjects.js";
import buildFooterRowSpec from "./buildFooterRowSpec.js";

/**
 * Footer Module (v3): Pure Orchestrator
 * Step 1: Collects all footer row data objects via collectFooterDataObjects helper
 * Step 2: Maps each data object to a <tr> DOM row spec on the fly via buildFooterRowSpec
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

    // 1. Data Object Pipeline
    const footerDataObjects = collectFooterDataObjects({
        inFooterConfig: localFooterConfig,
        inColumns: localColumns,
        inData: localData
    });

    // 2. DOM Spec Pipeline
    return footerDataObjects.map(dataObj =>
        buildFooterRowSpec({
            inDataObject: dataObj,
            inColumns: localColumns,
            inTrSpec: localTrSpec,
            inThSpec: localThSpec
        })
    ).filter(Boolean);
};

export default buildFooter;
