import { renderTable } from "../../../../webComponents/v6/core/controls/table/v22/index.js";

const tableContainer = document.getElementById("tableContainer");
const selectionBadge = document.getElementById("selectionBadge");

if (tableContainer) {
    // Raw stock items data (No serialNo column provided - auto computed by Data Mapper)
    const stockRows = [
        { StockItemName: "0.09/30mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs", Credit: 500 },
        { StockItemName: "0.11-25", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs", Debit: 250 },
        { StockItemName: "0.11-30", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs", Debit: 150 },
        { StockItemName: "0.11/32mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs", Debit: 350 },
        { StockItemName: "0.11/35mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs", Credit: 450 },
        { StockItemName: "0.13/32mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs", Credit: 200 },
        { StockItemName: "0.14/30mm", StockParentName: "COTTON FABRIC", Uom: "meters", Debit: 100 }
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
        theme: "dark",
        inTable: { inRows: stockRows },
        inEvents: { inOnRowClick: handleRowClick },
        data: stockRows,
        inVisibility: {
            showSearch: true,
            showTable: true
        },
        renderers: {
            table: {
                columns: ["StockItemName", "StockParentName", "Credit", "Debit"],
                footer: {
                    summaryRow: {
                        StockItemName: "count",
                        StockParentName: "max",
                        Credit: "sum",
                        Debit: "sum"
                    },
                    balanceRow: {
                        StockItemName: "count",
                        StockParentName: "max",
                        Credit: "Credit-Debit",
                        Debit: "Debit-Credit"
                    }
                }
            }
        }
    });

    if (tableElement) {
        tableContainer.appendChild(tableElement);
    }
}
