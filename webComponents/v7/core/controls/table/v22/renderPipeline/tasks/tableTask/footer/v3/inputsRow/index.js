import getObject from "./getObject.js";

/**
 * Self-contained Inputs Row Module for footer/v3
 */
export const getInputsRow = ({ inInputsConfig, inColumns }) => {
    const localInputsConfig = inInputsConfig;
    const localColumns = inColumns || [];

    if (!localInputsConfig) {
        return null;
    }

    return getObject({
        inInputsConfig: localInputsConfig,
        inColumns: localColumns
    });
};

export { getObject };
export default getInputsRow;
