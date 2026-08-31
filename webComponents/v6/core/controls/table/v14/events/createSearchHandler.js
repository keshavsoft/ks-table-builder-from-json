import renderUserUI from "../userUI/renderUserUI.js";

/**
 * Creates the internal search filter & re-render handler for table search input
 */
export const createSearchHandler = ({
    inSkeletonElement,
    inRows,
    inHeaders,
    inShowSerial,
    inShowBody,
    inOnSearch
}) => {
    const localSkeletonElement = inSkeletonElement;
    const localRows = inRows || [];
    const localHeaders = inHeaders;
    const localShowSerial = inShowSerial;
    const localShowBody = inShowBody;
    const localOnSearch = inOnSearch;

    return ({ inQuery, inEvent }) => {
        const query = (inQuery || "").toLowerCase();
        const filteredRows = localRows.filter(row => {
            return Object.entries(row).some(([key, val]) => {
                if (key === "serialNo") return false;
                return String(val || "").toLowerCase().includes(query);
            });
        });

        if (localShowBody) {
            renderUserUI({
                inSkeletonElement: localSkeletonElement,
                inRows: filteredRows,
                inHeaders: localHeaders,
                inShowSerial: localShowSerial
            });
        }

        if (typeof localOnSearch === "function") {
            localOnSearch({ inQuery, inFilteredRows: filteredRows, inEvent });
        }
    };
};

export default createSearchHandler;
