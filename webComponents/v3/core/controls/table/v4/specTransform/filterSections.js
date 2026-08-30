/**
 * Spec Transformer Task: Filters out table section nodes (thead, tbody, tfoot) based on visibility flags
 */
export const filterSections = ({ inSpec, inShowHeader = true, inShowBody = true, inShowFooter = true }) => {
    if (!inSpec || typeof inSpec !== "object") return inSpec;

    if (Array.isArray(inSpec)) {
        return inSpec
            .map(item => filterSections({ inSpec: item, inShowHeader, inShowBody, inShowFooter }))
            .filter(Boolean);
    }

    const tagName = inSpec.tagName?.toLowerCase();

    if (tagName === "thead" && !inShowHeader) return null;
    if (tagName === "tbody" && !inShowBody) return null;
    if (tagName === "tfoot" && !inShowFooter) return null;

    if (Array.isArray(inSpec.children)) {
        const filteredChildren = inSpec.children
            .map(child => filterSections({ inSpec: child, inShowHeader, inShowBody, inShowFooter }))
            .filter(Boolean);

        return {
            ...inSpec,
            children: filteredChildren
        };
    }

    return inSpec;
};

export default filterSections;
