/**
 * Layer 3b: Hydrates/Updates row values inside the table tbody element
 */
export const hydrateTableData = ({ inTableElement, inTarget, inRows }) => {
    const localTableElement = inTableElement;
    const localTarget = inTarget;
    const localRows = inRows || [];

    let targetElem = null;
    if (localTableElement instanceof Node) {
        targetElem = localTableElement;
    } else if (typeof localTarget === "string") {
        targetElem = document.querySelector(localTarget);
    } else if (typeof localTableElement === "string") {
        targetElem = document.querySelector(localTableElement);
    }

    if (!targetElem) return;

    const tbody = targetElem.querySelector('tbody') || targetElem;
    const trElements = tbody.querySelectorAll('tr');

    localRows.forEach((rowData, idx) => {
        const tr = trElements[idx];
        if (!tr) return;

        const cells = tr.querySelectorAll('td');
        if (cells[1]) cells[1].textContent = rowData.StockItemName || "";
        if (cells[2]) cells[2].textContent = rowData.StockParentName || "";
        if (cells[3]) cells[3].textContent = rowData.Uom || "";
    });
};

export default hydrateTableData;
