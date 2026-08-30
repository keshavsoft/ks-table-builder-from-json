import renderSkeleton from "./skeleton/renderSkeleton.js";
import bindSkeletonEvents from "./skeleton/bindSkeletonEvents.js";
import renderUserUI from "./userUI/renderUserUI.js";
import prepareTableData from "./userUI/prepareTableData.js";
import hydrateTableData from "./userUI/hydrateTableData.js";
import { runRenderPipeline, buildRenderPipeline } from "./renderPipeline/index.js";

/**
 * Table 3-Layer Skeleton Architecture Orchestrator with Search, Dynamic Headers & Section Toggles
 */
export const renderTable = ({
    inSpec,
    inTheme,
    inThemeName,
    inThemeSpec,
    inRows,
    inHeaders,
    inColumns,
    inOnRowClick,
    inOnSearch,
    inShowSerial = true,
    inShowSearch = true,
    inShowHeader = true,
    inShowBody = true,
    inShowFooter = true,
    inRenderPipeline
}) => {
    const localSpec = inSpec;
    const localTheme = inTheme;
    const localThemeName = inThemeName;
    const localThemeSpec = inThemeSpec;
    let localRows = inRows || [];
    const localHeaders = inHeaders || inColumns;
    const localOnRowClick = inOnRowClick;
    const localOnSearch = inOnSearch;
    const localShowSerial = inShowSerial !== false;
    const localShowSearch = inShowSearch !== false;
    const localShowHeader = inShowHeader !== false;
    const localShowBody = inShowBody !== false;
    const localShowFooter = inShowFooter !== false;
    const localRenderPipeline = inRenderPipeline;

    // Layer 1: Build Layout Skeleton DOM Shell (Toolbar + <thead> + <tbody> + <tfoot)
    const skeletonElement = renderSkeleton({
        inSpec: localSpec,
        inTheme: localTheme,
        inThemeName: localThemeName,
        inThemeSpec: localThemeSpec,
        inShowSerial: localShowSerial,
        inShowHeader: localShowHeader,
        inShowBody: localShowBody,
        inShowFooter: localShowFooter
    });

    // Layer 1b: Render Component Pipeline (DOM-level component transformations)
    const renderPipeline = Array.isArray(localRenderPipeline) && localRenderPipeline.length > 0
        ? localRenderPipeline
        : buildRenderPipeline({
            inShowSearch: localShowSearch
        });

    runRenderPipeline({
        inContext: { inSkeletonElement: skeletonElement },
        inPipeline: renderPipeline
    });

    // Internal Search Handler: Universal search across all properties of any record object
    const handleSearch = ({ inQuery, inEvent }) => {
        const query = (inQuery || "").toLowerCase();
        const filteredRows = localRows.filter(row => {
            return Object.entries(row).some(([key, val]) => {
                if (key === "serialNo") return false;
                return String(val || "").toLowerCase().includes(query);
            });
        });

        // Re-render only tbody slot with filtered rows
        if (localShowBody) {
            renderUserUI({
                inSkeletonElement: skeletonElement,
                inRows: filteredRows,
                inHeaders: localHeaders,
                inShowSerial: localShowSerial
            });
        }

        if (typeof localOnSearch === "function") {
            localOnSearch({ inQuery, inFilteredRows: filteredRows, inEvent });
        }
    };

    // Layer 2: Hook Skeleton Events
    bindSkeletonEvents({
        inTableElement: skeletonElement,
        inOnSearch: handleSearch,
        inOnRowClick: localOnRowClick
    });

    // Layer 3a: Inject & Render Initial Rows into tbody slot & dynamic thead
    if (localShowBody) {
        renderUserUI({
            inSkeletonElement: skeletonElement,
            inRows: localRows,
            inHeaders: localHeaders,
            inShowSerial: localShowSerial
        });
    }

    return skeletonElement;
};

// Re-export sub-module layers for fine-grained step-by-step orchestration
export {
    renderSkeleton,
    bindSkeletonEvents,
    renderUserUI,
    prepareTableData,
    hydrateTableData,
    runRenderPipeline,
    buildRenderPipeline
};

export default renderTable;
