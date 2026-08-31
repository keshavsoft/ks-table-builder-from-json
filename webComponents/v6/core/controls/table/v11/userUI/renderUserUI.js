import buildSpecElement from "../../../../../domCreation/v2/buildSpecElement.js";
import prepareTableData from "./prepareTableData.js";
import buildTableRowSpec from "./buildTableRowSpec.js";
import buildHeaderRowSpec from "./buildHeaderRowSpec.js";
import resolveColumns from "./resolveColumns.js";

/**
 * Layer 3: Table v11 User UI Render
 * Transforms row data, converts to <tr> DOM nodes, and mounts/refreshes them inside tbody slot.
 * Dynamically builds <thead> headers and <tbody> cells driven by inHeaders/inColumns or JSON record keys.
 */
export const renderUserUI = ({ inSkeletonElement, inTarget, inRows, inHeaders, inColumns, inShowSerial = true }) => {
    const localSkeletonElement = inSkeletonElement;
    const localTarget = inTarget;
    const localRows = inRows || [];
    const localShowSerial = inShowSerial !== false;

    // Resolve column definitions from inHeaders/inColumns or inRows
    const columns = resolveColumns({ inHeaders: inHeaders || inColumns, inRows: localRows });

    // 1. Resolve Target Container:
    let targetElem = null;

    if (localSkeletonElement instanceof Node) {
        targetElem = localSkeletonElement;
    } else if (typeof localTarget === "string") {
        targetElem = document.querySelector(localTarget);
    } else if (typeof localSkeletonElement === "string") {
        targetElem = document.querySelector(localSkeletonElement);
    }

    if (!targetElem) {
        targetElem = document.querySelector('tbody[slot="body"]') || document.querySelector('tbody') || document.body;
    }

    // 2. Locate thead and tbody containers
    const theadElem = targetElem instanceof Node ? targetElem.querySelector?.('thead') : null;
    const tbodySlotElem = (targetElem instanceof Node && targetElem.tagName?.toLowerCase() === "tbody")
        ? targetElem
        : (targetElem.querySelector?.('tbody[slot="body"]') || targetElem.querySelector?.('tbody') || targetElem);

    // 3. Dynamically populate <thead> column headers if <thead> exists
    if (theadElem && typeof theadElem.replaceChildren === "function") {
        const headerRowSpec = buildHeaderRowSpec({ inColumns: columns, inShowSerial: localShowSerial });
        const headerRowNode = buildSpecElement(headerRowSpec);
        theadElem.replaceChildren(headerRowNode);
    }

    // 4. Clear existing tbody rows for clean in-place slot re-hydration (Search/Filtering)
    if (tbodySlotElem && typeof tbodySlotElem.replaceChildren === "function") {
        tbodySlotElem.replaceChildren();
    }

    // 5. Data Transformation Layer
    const preparedRows = prepareTableData({ inRows: localRows });

    // 6. Build <tr> row specs
    const rowSpecs = preparedRows.map(rowData => buildTableRowSpec({ inRowData: rowData, inColumns: columns, inShowSerial: localShowSerial }));

    // 7. Convert row specs to DOM nodes
    const rowNodes = buildSpecElement(rowSpecs);

    // 8. Append/Mount row nodes into tbody slot container
    if (Array.isArray(rowNodes)) {
        rowNodes.forEach(node => tbodySlotElem.appendChild(node));
    } else if (rowNodes instanceof Node) {
        tbodySlotElem.appendChild(rowNodes);
    }

    return targetElem;
};

export default renderUserUI;
