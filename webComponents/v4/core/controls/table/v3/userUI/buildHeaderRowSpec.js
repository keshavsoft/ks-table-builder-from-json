/**
 * Table User UI Helper: Builds dynamic <thead> <tr> row spec with <th> cells
 */
export const buildHeaderRowSpec = ({ inColumns, inShowSerial = true }) => {
    const localColumns = inColumns || [];
    const localShowSerial = inShowSerial !== false;

    const thSpecs = [];

    if (localShowSerial) {
        thSpecs.push({
            tagName: "th",
            attributes: { class: "px-4 py-3 border-r border-gray-200 w-12 text-center" },
            textContent: "#"
        });
    }

    localColumns.forEach((col, index) => {
        const isLast = index === localColumns.length - 1;
        thSpecs.push({
            tagName: "th",
            attributes: { class: `px-4 py-3 ${isLast ? '' : 'border-r border-gray-200'}` },
            textContent: col.label
        });
    });

    return {
        tagName: "tr",
        attributes: { class: "text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" },
        children: thSpecs
    };
};

export default buildHeaderRowSpec;
