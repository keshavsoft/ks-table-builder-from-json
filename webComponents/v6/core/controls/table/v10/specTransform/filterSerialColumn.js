/**
 * Spec Transformer Task: Filters out or toggles the serial number (#) column elements in tr rows
 */
export const filterSerialColumn = ({ inSpec, inShowSerial = true }) => {
    if (!inSpec || typeof inSpec !== "object") return inSpec;

    if (Array.isArray(inSpec)) {
        return inSpec
            .map(item => filterSerialColumn({ inSpec: item, inShowSerial }))
            .filter(Boolean);
    }

    const tagName = inSpec.tagName?.toLowerCase();

    // If inside a tr element and inShowSerial is false, omit the 1st serial column element (#)
    if (tagName === "tr" && Array.isArray(inSpec.children)) {
        let children = inSpec.children;
        if (!inShowSerial) {
            children = children.filter((child, index) => {
                if (index === 0 && (child.textContent === "#" || child.attributes?.["data-serial"] === "true")) {
                    return false;
                }
                return true;
            });
        }
        return {
            ...inSpec,
            children: children.map(child => filterSerialColumn({ inSpec: child, inShowSerial })).filter(Boolean)
        };
    }

    if (Array.isArray(inSpec.children)) {
        const filteredChildren = inSpec.children
            .map(child => filterSerialColumn({ inSpec: child, inShowSerial }))
            .filter(Boolean);

        return {
            ...inSpec,
            children: filteredChildren
        };
    }

    return inSpec;
};

export default filterSerialColumn;
