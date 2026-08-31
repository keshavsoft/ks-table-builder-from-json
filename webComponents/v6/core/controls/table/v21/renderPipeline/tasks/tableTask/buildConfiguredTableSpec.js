import buildHeaderRowSpec from "./buildHeaderRowSpec.js";
import attachHeaderRowToThead from "./attachHeaderRowToThead.js";
import buildBodyRowsSpec from "./buildBodyRowsSpec.js";
import attachBodyRowsToTbody from "./attachBodyRowsToTbody.js";

/**
 * Helper: Orchestrates building dynamic header and body specs onto cloned tableSpec
 */
export const buildConfiguredTableSpec = ({ inDomTreeSpecs, inColumns, inData }) => {
    const localDomTreeSpecs = inDomTreeSpecs;
    const localData = inData || [];

    // Auto-derive columns from first row if columns not explicitly supplied
    let localColumns = inColumns;
    if ((!Array.isArray(localColumns) || localColumns.length === 0) && localData.length > 0) {
        localColumns = Object.keys(localData[0]);
    }

    const tableSpec = JSON.parse(JSON.stringify(localDomTreeSpecs.tableSpec));

    // Build & attach <thead> rows
    if (Array.isArray(localColumns) && localColumns.length > 0 && localDomTreeSpecs.trSpec && localDomTreeSpecs.thSpec) {
        const headerRow = buildHeaderRowSpec({
            inColumns: localColumns,
            inTrSpec: localDomTreeSpecs.trSpec,
            inThSpec: localDomTreeSpecs.thSpec
        });

        attachHeaderRowToThead({
            inTableSpec: tableSpec,
            inHeaderRow: headerRow
        });
    }

    // Build & attach <tbody> rows
    if (Array.isArray(localData) && localData.length > 0 && localDomTreeSpecs.trSpec && localDomTreeSpecs.tdSpec) {
        const bodyRows = buildBodyRowsSpec({
            inData: localData,
            inColumns: localColumns,
            inTrSpec: localDomTreeSpecs.trSpec,
            inTdSpec: localDomTreeSpecs.tdSpec
        });

        attachBodyRowsToTbody({
            inTableSpec: tableSpec,
            inBodyRows: bodyRows
        });
    }

    return tableSpec;
};

export default buildConfiguredTableSpec;
