/**
 * Recursively merges class attributes from inThemeSpec into inSpec tree
 */
export const applyTheme = ({ inSpec, inThemeSpec }) => {
    const localSpec = inSpec;
    const localThemeSpec = inThemeSpec;

    if (!localSpec || typeof localSpec !== "object") return localSpec;
    if (!localThemeSpec || typeof localThemeSpec !== "object") return localSpec;

    // Clone attributes and apply theme class if present
    const mergedAttributes = {
        ...(localSpec.attributes || {})
    };

    if (localThemeSpec.attributes && localThemeSpec.attributes.class) {
        mergedAttributes.class = localThemeSpec.attributes.class;
    }

    const specChildren = Array.isArray(localSpec.children) ? localSpec.children : [];
    const themeChildren = Array.isArray(localThemeSpec.children) ? localThemeSpec.children : [];

    const mergedChildren = specChildren.map((childSpec, index) => {
        const matchingThemeChild = themeChildren[index];
        return applyTheme({
            inSpec: childSpec,
            inThemeSpec: matchingThemeChild
        });
    });

    return {
        ...localSpec,
        attributes: mergedAttributes,
        children: mergedChildren
    };
};

export default applyTheme;
