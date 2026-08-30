import { renderSkeleton, renderUserUI, bindSkeletonEvents } from "../../webComponents/v2/core/controls/table/v1/index.js";

const tableContainer = document.getElementById("tableContainer");
const selectionBadge = document.getElementById("selectionBadge");

if (tableContainer) {
    // PHASE 1: Render & Mount Table Skeleton immediately
    const skeletonElement = renderSkeleton({ inTheme: "medium" });

    bindSkeletonEvents({
        inTableElement: skeletonElement,
        inOnRowClick: ({ inRowElement, inEvent }) => {
            const localRowElement = inRowElement;
            const itemName = localRowElement.children[1]?.textContent;
            const parentName = localRowElement.children[2]?.textContent;

            if (selectionBadge) {
                selectionBadge.textContent = `Selected: ${itemName} (${parentName})`;
                selectionBadge.classList.remove("hidden");
            }
        }
    });

    tableContainer.appendChild(skeletonElement);

    // PHASE 2: (Async API Simulation) Populate Rows into Mounted Table tbody
    setTimeout(() => {
        const stockRows = [
            { StockItemName: "0.09/30mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
            { StockItemName: "0.11-25", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
            { StockItemName: "0.11-30", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
            { StockItemName: "0.11/32mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
            { StockItemName: "0.11/35mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
            { StockItemName: "0.13/32mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
            { StockItemName: "0.14/30mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" }
        ];

        renderUserUI({
            inSkeletonElement: skeletonElement,
            inRows: stockRows
        });
    }, 600);
}
