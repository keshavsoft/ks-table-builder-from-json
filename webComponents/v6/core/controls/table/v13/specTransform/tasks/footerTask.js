/**
 * Task Transformer: Toggles the <tfoot /> footer section in the JSON Spec
 */
export const createFooterTask = ({ inShowFooter = true }) => {
    return ({ inSpec }) => {
        if (inShowFooter) return inSpec;

        const filterFooter = (spec) => {
            if (!spec || typeof spec !== "object") return spec;
            if (Array.isArray(spec)) return spec.map(filterFooter).filter(Boolean);

            if (spec.tagName?.toLowerCase() === "tfoot") return null;

            if (Array.isArray(spec.children)) {
                return {
                    ...spec,
                    children: spec.children.map(filterFooter).filter(Boolean)
                };
            }
            return spec;
        };

        return filterFooter(inSpec);
    };
};

export default createFooterTask;
