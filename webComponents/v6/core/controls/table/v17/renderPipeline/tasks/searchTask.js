import searchSpec from "./searchSpec.json" with { type: "json" };

/**
 * Render Task Transformer: Creates and returns the search toolbar DOM element during rendering
 */
export const createSearchTask = ({
    inShowSearch = true
} = {}) => {
    const localShowSearch = inShowSearch !== false;

    return () => {
        if (localShowSearch) {
            return searchSpec;
        };

        return null;
    };
};

export default createSearchTask;
