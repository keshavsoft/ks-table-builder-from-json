import buildBodyRowsSpec from "./buildBodyRowsSpec.js";

/**
 * Body Module: Pure function returning <tbody> <tr> row specs array
 */
export const buildBody = ({ inData, inColumns, inTrSpec, inTdSpec }) => {
    const localData = inData || [];
    const localColumns = inColumns || [];
    const localTrSpec = inTrSpec;
    const localTdSpec = inTdSpec;

    if (!Array.isArray(localData) || localData.length === 0 || !localTrSpec || !localTdSpec) {
        return [];
    }

    return buildBodyRowsSpec({
        inData: localData,
        inColumns: localColumns,
        inTrSpec: localTrSpec,
        inTdSpec: localTdSpec
    });
};

export default buildBody;
