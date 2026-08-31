/**
 * Layer 2: Table v11 Skeleton Events
 * Hooks Search Input 'input' listener and Table row click events onto the skeleton DOM tree.
 */
export const bindSkeletonEvents = ({ inTableElement, inOnSearch, inOnRowClick }) => {
    const localTableElement = inTableElement;
    const localOnSearch = inOnSearch;
    const localOnRowClick = inOnRowClick;

    if (!localTableElement) return;

    // 1. Hook Search Input 'input' Listener
    const searchInput = localTableElement.querySelector("#tableSearchInput") || localTableElement.querySelector("input[type='text']");
    if (searchInput && typeof localOnSearch === "function") {
        searchInput.addEventListener("input", (event) => {
            const query = event.target.value || "";
            localOnSearch({ inQuery: query, inEvent: event });
        });
    }

    // 2. Hook Row Click Listener
    if (typeof localOnRowClick === "function") {
        localTableElement.addEventListener("click", (event) => {
            const row = event.target.closest("tr");
            if (row && row.parentElement.tagName.toLowerCase() === "tbody") {
                localOnRowClick({ inRowElement: row, inEvent: event });
            }
        });
    }
};

export default bindSkeletonEvents;
