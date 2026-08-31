import getRow from "./getRow.js";

/**
 * Summary Row Module (v2): Self-contained summary row builder with explanatory function names
 */
export const getSummaryRow = ({ inBalanceConfig, inColumns, inData, inTrSpec, inThSpec }) => {
    const localBalanceConfig = inBalanceConfig;
    const localColumns = inColumns || [];
    const localData = inData || [];
    const localTrSpec = inTrSpec;
    const localThSpec = inThSpec;

    if (!localBalanceConfig || typeof localBalanceConfig !== "object" || !localTrSpec || !localThSpec) {
        return null;
    };

    return getRow({
        inConfig: localBalanceConfig,
        inColumns: localColumns,
        inData: localData,
        inTrSpec: localTrSpec,
        inThSpec: localThSpec
    });
};

export { getRow };
export default getSummaryRow;
