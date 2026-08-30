/**
 * Helper to format property keys into human readable title strings
 */
export const formatColumnHeader = (key) => {
    if (!key) return "";
    if (key === "Uom" || key === "uom" || key === "UOM") return "UOM";
    if (key === "ID" || key === "id" || key === "Id") return "ID";

    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
        .trim();
};

/**
 * Resolves column definitions from explicit inHeaders/inColumns or dynamically from inRows[0]
 */
export const resolveColumns = ({ inHeaders, inColumns, inRows }) => {
    const rawHeaders = inHeaders || inColumns;

    if (Array.isArray(rawHeaders) && rawHeaders.length > 0) {
        return rawHeaders.map(col => {
            if (typeof col === "string") {
                return { key: col, label: formatColumnHeader(col) };
            }
            return {
                key: col.key || col.field || col.name || col.id,
                label: col.label || col.title || col.header || formatColumnHeader(col.key || col.field || col.name || col.id)
            };
        });
    }

    if (Array.isArray(inRows) && inRows.length > 0 && inRows[0] && typeof inRows[0] === "object") {
        const keys = Object.keys(inRows[0]).filter(k => k !== "serialNo");
        return keys.map(key => ({
            key: key,
            label: formatColumnHeader(key)
        }));
    }

    // Default fallback columns if no rows or headers passed yet
    return [
        { key: "StockItemName", label: "Stock Item Name" },
        { key: "StockParentName", label: "Stock Parent Name" },
        { key: "Uom", label: "UOM" }
    ];
};

export default resolveColumns;
