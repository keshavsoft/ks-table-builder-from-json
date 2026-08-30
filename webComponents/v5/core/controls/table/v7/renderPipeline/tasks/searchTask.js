/**
 * Render Task Transformer: Toggles the search input DOM component during rendering
 */
export const createSearchTask = ({ inShowSearch = true } = {}) => {
    const localShowSearch = inShowSearch !== false;

    return ({ inContext }) => {
        const localContext = inContext;
        const skeletonElement = localContext?.inSkeletonElement;

        if (!localShowSearch && skeletonElement) {
            const searchInput = skeletonElement.querySelector("#tableSearchInput");
            if (searchInput) {
                searchInput.remove();
            }
        }

        return localContext;
    };
};

export default createSearchTask;
