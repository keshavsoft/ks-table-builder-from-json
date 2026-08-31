import { renderTable } from "../../../../webComponents/v6/core/controls/table/v17/index.js";

const tableContainer = document.getElementById("tableContainer");
const selectionBadge = document.getElementById("selectionBadge");

if (tableContainer) {
    // Raw stock items data (No serialNo column provided - auto computed by Data Mapper)
    const stockRows = [
        { StockItemName: "0.09/30mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
        { StockItemName: "0.11-25", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
        { StockItemName: "0.11-30", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
        { StockItemName: "0.11/32mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
        { StockItemName: "0.11/35mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
        { StockItemName: "0.13/32mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
        { StockItemName: "0.14/30mm", StockParentName: "COTTON FABRIC", Uom: "meters" }
    ];

    const handleRowClick = ({ inRowElement, inEvent }) => {
        const localRowElement = inRowElement;
        const itemName = localRowElement.children[1]?.textContent;
        const parentName = localRowElement.children[2]?.textContent;

        if (selectionBadge) {
            selectionBadge.textContent = `Selected: ${itemName} (${parentName})`;
            selectionBadge.classList.remove("hidden");
        }
    };

    // Table Render (v9 Single-Call orchestrator pattern with responsibility-grouped options)
    const tableElement = renderTable({
        inTheme: { inTheme: "light" },
        inTable: { inRows: stockRows },
        inEvents: { inOnRowClick: handleRowClick },
        inVisibility: {
            showSearch: false,
            showTable: true
        }
    });

    if (tableElement) {
        tableContainer.appendChild(tableElement);
    }
}
