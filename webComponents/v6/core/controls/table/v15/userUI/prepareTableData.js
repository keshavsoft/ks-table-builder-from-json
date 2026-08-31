/**
 * Layer 3 Mapper: Data Transformation Layer
 * Transforms raw API record objects by computing serial numbers and preserving all payload properties.
 */
export const prepareTableData = ({ inRows }) => {
    const localRows = inRows || [];

    return localRows.map((row, index) => {
        if (!row || typeof row !== "object") return { serialNo: index + 1 };
        return {
            serialNo: index + 1,
            ...row
        };
    });
};

export default prepareTableData;
