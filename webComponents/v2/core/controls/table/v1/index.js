import renderSkeleton from "./skeleton/renderSkeleton.js";
import bindSkeletonEvents from "./skeleton/bindSkeletonEvents.js";
import renderUserUI from "./userUI/renderUserUI.js";
import prepareTableData from "./userUI/prepareTableData.js";
import hydrateTableData from "./userUI/hydrateTableData.js";

/**
 * Table v11 3-Layer Skeleton Architecture Orchestrator with Search & Data Mapper
 *
 * Layer 1: Table Skeleton & Toolbar Creation (`renderSkeleton`)
 * Layer 2: Skeleton Event Hooking (`bindSkeletonEvents` -> Search & Row Click)
 * Layer 3: Data Transformation (`prepareTableData`), Slot Mounting (`renderUserUI`), and Hydration (`hydrateTableData`)
 */
export const renderTable = ({ inSpec, inTheme, inThemeName, inThemeSpec, inRows, inOnRowClick, inOnSearch }) => {
    const localSpec = inSpec;
    const localTheme = inTheme;
    const localThemeName = inThemeName;
    const localThemeSpec = inThemeSpec;
    let localRows = inRows || [];
    const localOnRowClick = inOnRowClick;
    const localOnSearch = inOnSearch;

    // Layer 1: Build Layout Skeleton DOM Shell (Toolbar + <thead> + empty tbody slot)
    const skeletonElement = renderSkeleton({
        inSpec: localSpec,
        inTheme: localTheme,
        inThemeName: localThemeName,
        inThemeSpec: localThemeSpec
    });

    // Internal Search Handler: Filters rows & refreshes tbody slot in-place!
    const handleSearch = ({ inQuery, inEvent }) => {
        const query = (inQuery || "").toLowerCase();
        const filteredRows = localRows.filter(row => {
            const name = (row.StockItemName || "").toLowerCase();
            const parent = (row.StockParentName || "").toLowerCase();
            const uom = (row.Uom || row.StockBaseUnits || "").toLowerCase();
            return name.includes(query) || parent.includes(query) || uom.includes(query);
        });

        // Re-render only tbody slot with filtered rows
        renderUserUI({
            inSkeletonElement: skeletonElement,
            inRows: filteredRows
        });

        if (typeof localOnSearch === "function") {
            localOnSearch({ inQuery, inFilteredRows: filteredRows, inEvent });
        }
    };

    // Layer 2: Hook Skeleton Events (Search input & Row click listeners)
    bindSkeletonEvents({
        inTableElement: skeletonElement,
        inOnSearch: handleSearch,
        inOnRowClick: localOnRowClick
    });

    // Layer 3a: Inject & Render Initial Rows into tbody slot
    renderUserUI({
        inSkeletonElement: skeletonElement,
        inRows: localRows
    });

    return skeletonElement;
};

// Re-export sub-module layers for fine-grained step-by-step orchestration
export {
    renderSkeleton,
    bindSkeletonEvents,
    renderUserUI,
    prepareTableData,
    hydrateTableData
};

export default renderTable;
