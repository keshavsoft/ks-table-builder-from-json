/**
 * Task Transformer: Toggles the serial number (#) column elements in tr rows
 */
export const createSerialTask = ({ inShowSerial = true }) => {
    return ({ inSpec }) => {
        if (inShowSerial) return inSpec;

        const filterSerial = (spec) => {
            if (!spec || typeof spec !== "object") return spec;
            if (Array.isArray(spec)) return spec.map(filterSerial).filter(Boolean);

            const tagName = spec.tagName?.toLowerCase();

            if (tagName === "tr" && Array.isArray(spec.children)) {
                const filteredChildren = spec.children.filter((child, index) => {
                    if (index === 0 && (child.textContent === "#" || child.attributes?.["data-serial"] === "true")) {
                        return false;
                    }
                    return true;
                });

                return {
                    ...spec,
                    children: filteredChildren.map(filterSerial).filter(Boolean)
                };
            }

            if (Array.isArray(spec.children)) {
                return {
                    ...spec,
                    children: spec.children.map(filterSerial).filter(Boolean)
                };
            }
            return spec;
        };

        return filterSerial(inSpec);
    };
};

export default createSerialTask;
