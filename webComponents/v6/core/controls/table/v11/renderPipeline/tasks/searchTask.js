/**
 * Render Task Transformer: Toggles the search input DOM component during rendering
 */
export const createSearchTask = ({ inShowSearch = true } = {}) => {
    const localShowSearch = inShowSearch !== false;

    return ({ inContext }) => {
        const localContext = inContext;
        const skeletonElement = localContext?.inSkeletonElement;

        if (!localShowSearch && skeletonElement) {
            const toolbar = skeletonElement.querySelector(".table-toolbar");
            if (toolbar) {
                toolbar.remove();
            } else {
                const searchInput = skeletonElement.querySelector("#tableSearchInput");
                if (searchInput) {
                    searchInput.remove();
                }
            }
        }

        return localContext;
    };
};

export default createSearchTask;
