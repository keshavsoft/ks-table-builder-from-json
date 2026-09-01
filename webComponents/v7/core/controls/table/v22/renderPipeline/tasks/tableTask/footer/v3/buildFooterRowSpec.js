/**
 * Shared Footer Helper (v3): Converts any calculated data object into a <tr> row spec
 */
export const buildFooterRowSpec = ({ inDataObject, inColumns, inTrSpec, inThSpec, inInputSpec }) => {
    const localDataObject = inDataObject || {};
    const localColumns = inColumns || [];
    const localTrSpec = inTrSpec;
    const localThSpec = inThSpec;
    const localInputSpec = inInputSpec;

    if (!localTrSpec || !localThSpec) {
        return null;
    }

    const trNode = JSON.parse(JSON.stringify(localTrSpec));

    trNode.children = localColumns.map(columnKey => {
        const keyName = typeof columnKey === "object"
            ? (columnKey.field || columnKey.name || columnKey.label)
            : columnKey;

        const cellValue = localDataObject[keyName] !== undefined
            ? localDataObject[keyName]
            : "";

        const thNode = JSON.parse(JSON.stringify(localThSpec));
        const inputNode = JSON.parse(JSON.stringify(localInputSpec));
        thNode.textContent = "";

        // inputNode.value = cellValue;
        thNode.children = [inputNode];
        return thNode;
    });

    return trNode;
};

export default buildFooterRowSpec;
