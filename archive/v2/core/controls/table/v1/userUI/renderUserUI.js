import buildSpecElement from "../../../../../domCreation/v2/buildSpecElement.js";
import prepareTableData from "./prepareTableData.js";
import buildTableRowSpec from "./buildTableRowSpec.js";

/**
 * Layer 3: Table v11 User UI Render
 * Transforms row data, converts to <tr> DOM nodes, and mounts/refreshes them inside tbody slot.
 * Supports both In-Memory DOM Nodes (inSkeletonElement) and Global Page DOM Targets (inTarget).
 */
export const renderUserUI = ({ inSkeletonElement, inTarget, inRows }) => {
    const localSkeletonElement = inSkeletonElement;
    const localTarget = inTarget;
    const localRows = inRows || [];

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

    // 2. Locate tbody slot container
    const tbodySlotElem = (targetElem instanceof Node && targetElem.tagName?.toLowerCase() === "tbody")
        ? targetElem
        : (targetElem.querySelector?.('tbody[slot="body"]') || targetElem.querySelector?.('tbody') || targetElem);

    // 3. Clear existing tbody rows for clean in-place slot re-hydration (Search/Filtering)
    if (tbodySlotElem && typeof tbodySlotElem.replaceChildren === "function") {
        tbodySlotElem.replaceChildren();
    }

    // 4. Data Transformation Layer (maps raw records -> adds serialNo)
    const preparedRows = prepareTableData({ inRows: localRows });

    // 5. Build <tr> row specs
    const rowSpecs = preparedRows.map(rowData => buildTableRowSpec({ inRowData: rowData }));

    // 6. Convert row specs to DOM nodes
    const rowNodes = buildSpecElement(rowSpecs);

    // 7. Append/Mount row nodes into tbody slot container
    if (Array.isArray(rowNodes)) {
        rowNodes.forEach(node => tbodySlotElem.appendChild(node));
    } else if (rowNodes instanceof Node) {
        tbodySlotElem.appendChild(rowNodes);
    }

    return targetElem;
};

export default renderUserUI;
