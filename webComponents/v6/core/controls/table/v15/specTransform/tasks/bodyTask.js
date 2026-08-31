/**
 * Task Transformer: Toggles the <tbody /> body section in the JSON Spec
 */
export const createBodyTask = ({ inShowBody = true }) => {
    return ({ inSpec }) => {
        if (inShowBody) return inSpec;

        const filterBody = (spec) => {
            if (!spec || typeof spec !== "object") return spec;
            if (Array.isArray(spec)) return spec.map(filterBody).filter(Boolean);

            if (spec.tagName?.toLowerCase() === "tbody") return null;

            if (Array.isArray(spec.children)) {
                return {
                    ...spec,
                    children: spec.children.map(filterBody).filter(Boolean)
                };
            }
            return spec;
        };

        return filterBody(inSpec);
    };
};

export default createBodyTask;
