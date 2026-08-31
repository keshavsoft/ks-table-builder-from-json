/**
 * Helper: Builds individual <th> header cell spec from column item
 */
const buildHeaderCellSpec = ({ inColumn, inThSpec }) => {
    const localColumn = inColumn;
    const localThSpec = inThSpec;

    const thNode = JSON.parse(JSON.stringify(localThSpec));
    thNode.textContent = typeof localColumn === "object"
        ? (localColumn.label || localColumn.field || localColumn.name)
        : localColumn;

    return thNode;
};

/**
 * Helper: Builds <tr> header row spec containing <th> cell specs
 */
const buildHeaderRowSpec = ({ inColumns, inTrSpec, inThSpec }) => {
    const localColumns = inColumns || [];
    const localTrSpec = inTrSpec;
    const localThSpec = inThSpec;

    const trNode = JSON.parse(JSON.stringify(localTrSpec));
    trNode.children = localColumns.map(column =>
        buildHeaderCellSpec({ inColumn: column, inThSpec: localThSpec })
    );

    return trNode;
};

/**
 * Helper: Attaches header <tr> row to <thead> in tableSpec
 */
const attachHeaderRowToThead = ({ inTableSpec, inHeaderRow }) => {
    const localTableSpec = inTableSpec;
    const localHeaderRow = inHeaderRow;

    const theadNode = localTableSpec.children?.find(child => child.tagName === "thead");
    if (theadNode) {
        theadNode.children = [localHeaderRow];
    }
};

/**
 * Helper: Builds configured table specification by attaching dynamic header row
 */
const buildConfiguredTableSpec = ({ inDomTreeSpecs, inColumns }) => {
    const localDomTreeSpecs = inDomTreeSpecs;
    const localColumns = inColumns || [];

    const tableSpec = JSON.parse(JSON.stringify(localDomTreeSpecs.tableSpec));

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

    return tableSpec;
};

/**
 * Render Task Transformer: Creates and appends the <table> DOM element skeleton during rendering
 */
export const createTableTask = ({
    inShowTable = true,
    domTreeJsonFiles,
    inRendererConfig, inData
} = {}) => {
    const localShowTable = inShowTable !== false;
    const localDomTreeSpecs = domTreeJsonFiles;
    const localRendererConfig = inRendererConfig;
    console.log("inData : ", inData);

    return () => {
        if (!localShowTable) {
            return null;
        }

        const columns = localRendererConfig?.columns || [];

        return buildConfiguredTableSpec({
            inDomTreeSpecs: localDomTreeSpecs,
            inColumns: columns
        });
    };
};

export default createTableTask;


