/**
 * Table User UI Helper: Builds a single <tr> row spec with <td> cells from a mapped data record
 * Generates dynamic <td> cells based on inColumns or keys of inRowData.
 */
export const buildTableRowSpec = ({ inRowData, inColumns, inShowSerial = true }) => {
    const localRowData = inRowData || {};
    const localShowSerial = inShowSerial !== false;
    const serialNo = localRowData.serialNo || 1;

    const cellSpecs = [];

    if (localShowSerial) {
        cellSpecs.push({
            tagName: "td",
            attributes: { class: "px-4 py-3 border-r border-gray-200 font-mono text-xs text-gray-500 w-12 text-center" },
            textContent: String(serialNo)
        });
    }

    const columns = (Array.isArray(inColumns) && inColumns.length > 0)
        ? inColumns
        : Object.keys(localRowData)
            .filter(k => k !== "serialNo")
            .map(k => ({ key: k, label: k }));

    columns.forEach((col, index) => {
        const isLast = index === columns.length - 1;
        const val = localRowData[col.key];
        const displayVal = (val === null || val === undefined) ? "" : String(val);

        cellSpecs.push({
            tagName: "td",
            attributes: { class: `px-4 py-3 ${isLast ? '' : 'border-r border-gray-200'}` },
            textContent: displayVal
        });
    });

    return {
        tagName: "tr",
        attributes: { class: "hover:bg-gray-50 transition-colors border-b border-gray-200 cursor-pointer" },
        children: cellSpecs
    };
};

export default buildTableRowSpec;
