/**
 * Step 1: Generates key-value data object(s) for inputsRow.
 * Supports single input row config or an array of multiple input row configs.
 */
export const getObject = ({ inInputsConfig, inColumns }) => {
    const localInputsConfig = inInputsConfig;
    const localColumns = inColumns || [];

    if (!localInputsConfig) {
        return null;
    }

    // Helper: Build single input data object from a config item
    const buildSingleInputObject = (configItem) => {
        const inputObject = {};

        localColumns.forEach(columnKey => {
            const keyName = typeof columnKey === "object"
                ? (columnKey.field || columnKey.name || columnKey.label)
                : columnKey;

            if (Array.isArray(configItem)) {
                // If configItem is array of field names e.g. ["StockItemName", "Credit", "Debit"]
                if (configItem.includes(keyName)) {
                    inputObject[keyName] = "";
                }
            } else if (configItem && typeof configItem === "object") {
                // If configItem is an object e.g. { StockItemName: "", Credit: "" }
                if (configItem[keyName] !== undefined) {
                    inputObject[keyName] = String(configItem[keyName]);
                }
            }
        });

        return inputObject;
    };

    // Check if localInputsConfig is an array of multiple row configs
    if (Array.isArray(localInputsConfig)) {
        const isMultipleRows = localInputsConfig.length > 0 && (
            Array.isArray(localInputsConfig[0]) || typeof localInputsConfig[0] === "object"
        );

        if (isMultipleRows) {
            return localInputsConfig.map(rowConfig => buildSingleInputObject(rowConfig));
        }
    }

    return buildSingleInputObject(localInputsConfig);
};

export default getObject;
