import searchSpec from "./searchSpec.json" with { type: "json" };

/**
 * Render Task Transformer: Creates and returns the search toolbar DOM element during rendering
 */
export const createSearchTask = ({
    inShowSearch = true,
    inSpec,
    inDomCreationFuncs
} = {}) => {
    const localShowSearch = inShowSearch !== false;
    const localSpec = inSpec || searchSpec;
    const localDomCreationFuncs = inDomCreationFuncs;

    return () => {
        if (localShowSearch) {
            if (localDomCreationFuncs?.versions && localDomCreationFuncs?.maxVersion) {
                return localDomCreationFuncs.versions[localDomCreationFuncs.maxVersion](localSpec);
            };
            // return buildSpecElement(localSpec);
        }
        return null;
    };
};

export default createSearchTask;
