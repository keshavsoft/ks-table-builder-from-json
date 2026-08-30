/**
 * Layer 3 Mapper: Data Transformation Layer
 * Transforms raw API record objects by computing serial numbers, formatting fields, or adding flags.
 */
export const prepareTableData = ({ inRows }) => {
    const localRows = inRows || [];

    return localRows.map((row, index) => {
        return {
            ...row,
            serialNo: index + 1,
            StockItemName: row.StockItemName || "",
            StockParentName: row.StockParentName || "",
            Uom: row.Uom || row.StockBaseUnits || ""
        };
    });
};

export default prepareTableData;
