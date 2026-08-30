import renderSkeleton from "./skeleton/renderSkeleton.js";
import bindSkeletonEvents from "./skeleton/bindSkeletonEvents.js";
import renderUserUI from "./userUI/renderUserUI.js";
import prepareTableData from "./userUI/prepareTableData.js";
import hydrateTableData from "./userUI/hydrateTableData.js";
import { runRenderPipeline, buildRenderPipeline } from "./renderPipeline/index.js";
import resolveTableOptions from "./options/resolveTableOptions.js";
import createSearchHandler from "./events/createSearchHandler.js";

/**
 * Table 3-Layer Skeleton Architecture Orchestrator
 */
export const renderTable = (inOptions = {}) => {
    const localOptions = inOptions;

    // Step 1: Resolve & normalize configuration options
    const options = resolveTableOptions(localOptions);

    // Step 2: Layer 1 - Build Layout Skeleton DOM Shell
    const skeletonElement = renderSkeleton(options.skeletonOptions);

    // Step 3: Layer 1b - Execute Render Component Pipeline
    runRenderPipeline({
        inContext: { inSkeletonElement: skeletonElement },
        inPipeline: options.renderPipeline
    });

    // Step 4: Layer 2 - Hook Skeleton Events (Search & Row Click)
    bindSkeletonEvents({
        inTableElement: skeletonElement,
        inOnSearch: createSearchHandler({
            inSkeletonElement: skeletonElement,
            inRows: options.rows,
            inHeaders: options.headers,
            inShowSerial: options.showSerial,
            inShowBody: options.showBody,
            inOnSearch: options.onSearch
        }),
        inOnRowClick: options.onRowClick
    });

    // Step 5: Layer 3 - Inject & Render Initial Rows into tbody slot
    if (options.showBody) {
        renderUserUI({
            inSkeletonElement: skeletonElement,
            inRows: options.rows,
            inHeaders: options.headers,
            inShowSerial: options.showSerial
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
    buildRenderPipeline,
    resolveTableOptions,
    createSearchHandler
};

export default renderTable;
