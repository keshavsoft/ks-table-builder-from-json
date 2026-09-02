import { renderTable } from "../../../../webComponents/v7/core/controls/table/v25/index.js";
import directJs from "../../../../webComponents/v7/core/controls/table/v23/direct.js";
import buildSpecFromElement from "../../../../webComponents/v7/domToJson/v1/buildSpecFromElement.js";
import { compareSpecs } from "../../../../webComponents/v7/specCompare/v1/compareSpecs.js";

import stockItemsJson from "./stockItems.json" with { type: "json" };

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
    renderTable({
        toRenderHtmlId: "tableContainer",
        theme1: "dark",
        inTable: { inRows: stockItemsJson },
        inEvents: { inOnRowClick: handleRowClick },
        data: stockItemsJson,
        inVisibility: {
            showSearch: true,
            showTable: true
        },
        columnsConfig: [
            { key: "StockItemName", label: "Stock Item Name" },
            { key: "StockParentName", label: "Stock Parent Name" },
            { key: "Uom", label: "Unit of Measurement" },
            { key: "Credit", label: "Credit" },
            { key: "Debit", label: "Debit" }
        ],
        renderers: {
            table: {
                columns: ["StockItemName", "StockParentName", "Uom"],
                footer: {
                    summaryRow: {
                        StockItemName: "count",
                        Credit: "sum",
                        Debit: "sum"
                    },
                    balanceRow1: {
                        StockItemName: "111",
                        Credit: "Credit-Debit",
                        Debit: "Debit-Credit"
                    },
                    inputsRow1: [
                        ["StockItemName", "Credit", "Debit"]
                    ]

                }
            }
        }
    });

    // if (tableElement) {
    //     tableContainer.appendChild(tableElement);

    //     // Reconstruct JSON Spec from rendered DOM Element
    //     const jsonSpec = buildSpecFromElement({ inElement: tableElement });
    //     console.log("Reverted JSON Spec from DOM:", jsonSpec);

    //     const report = compareSpecs({ inFromSpec: tableElement, inToSpec: jsonSpec });
    //     console.log("Spec Comparison Report:", report);
    // };

    // tableContainer.appendChild(directJs());

}
