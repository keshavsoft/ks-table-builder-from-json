/**
 * Task Transformer: Toggles the <thead /> header section in the JSON Spec
 */
export const createHeaderTask = ({ inShowHeader = true }) => {
    return ({ inSpec }) => {
        if (inShowHeader) return inSpec;

        const filterHeader = (spec) => {
            if (!spec || typeof spec !== "object") return spec;
            if (Array.isArray(spec)) return spec.map(filterHeader).filter(Boolean);

            if (spec.tagName?.toLowerCase() === "thead") return null;

            if (Array.isArray(spec.children)) {
                return {
                    ...spec,
                    children: spec.children.map(filterHeader).filter(Boolean)
                };
            }
            return spec;
        };

        return filterHeader(inSpec);
    };
};

export default createHeaderTask;
