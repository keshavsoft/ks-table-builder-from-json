import buildHead from "./head/index.js";
import buildBody from "./body/index.js";
import buildFooter from "./footer/v4/index.js";

/**
 * Builds the complete <thead> spec node populated with head row/cell specs.
 */
export const getHead = ({ inDomTreeSpecs, inColumns }) => {
    const localDomTreeSpecs = inDomTreeSpecs;
    const localColumns = inColumns || [];

    const headRows = buildHead({
        inColumns: localColumns,
        inTrSpec: localDomTreeSpecs.trSpec,
        inThSpec: localDomTreeSpecs.thSpec
    });

    const theadNode = JSON.parse(JSON.stringify(
        localDomTreeSpecs.tableSpec.children?.find(child => child.tagName === "thead") || { tagName: "thead", children: [] }
    ));

    if (Array.isArray(headRows) && headRows.length > 0) {
        theadNode.children = headRows;
    }

    return theadNode;
};

/**
 * Builds the complete <tbody> spec node populated with body row/cell specs.
 */
export const getBody = ({ inDomTreeSpecs, inData }) => {
    const localDomTreeSpecs = inDomTreeSpecs;
    const localData = inData || [];

    const bodyRows = buildBody({
        inData: localData,
        inTrSpec: localDomTreeSpecs.trSpec,
        inTdSpec: localDomTreeSpecs.tdSpec
    });

    const tbodyNode = JSON.parse(JSON.stringify(
        localDomTreeSpecs.tableSpec.children?.find(child => child.tagName === "tbody") || { tagName: "tbody", children: [] }
    ));

    if (Array.isArray(bodyRows) && bodyRows.length > 0) {
        tbodyNode.children = bodyRows;
    }

    return tbodyNode;
};

/**
 * Builds the complete <tfoot> spec node populated with footer row/cell specs.
 */
export const getFooter = ({
    inDomTreeSpecs,
    inColumns,
    inData,
    inHasFooterConfig,
    inFooterConfig
}) => {
    const localDomTreeSpecs = inDomTreeSpecs;
    const localColumns = inColumns || [];
    const localData = inData || [];
    const localHasFooterConfig = inHasFooterConfig;
    const localFooterConfig = inFooterConfig;

    if (!localHasFooterConfig) {
        return null;
    }

    const footerRows = buildFooter({
        inHasFooterConfig: localHasFooterConfig,
        inFooterConfig: localFooterConfig,
        inColumns: localColumns,
        inData: localData,
        inTrSpec: localDomTreeSpecs.trSpec,
        inThSpec: localDomTreeSpecs.thSpec,
        inInputSpec: localDomTreeSpecs.inputSpec
    });

    if (!Array.isArray(footerRows) || footerRows.length === 0) {
        return null;
    }

    const tfootNode = JSON.parse(JSON.stringify(
        localDomTreeSpecs.tableSpec.children?.find(child => child.tagName === "tfoot") || { tagName: "tfoot", children: [] }
    ));

    tfootNode.children = footerRows;

    return tfootNode;
};

/**
 * Main Orchestrator: Combines head, body, and footer section nodes into tableSpec.
 */
export const buildConfiguredTableSpec = ({
    inDomTreeSpecs,
    inColumns,
    inData,
    inHasFooterConfig,
    inFooterConfig
}) => {
    const localDomTreeSpecs = inDomTreeSpecs;
    const localColumns = inColumns || [];
    const localData = inData || [];
    const localHasFooterConfig = inHasFooterConfig;
    const localFooterConfig = inFooterConfig;

    const tableSpec = JSON.parse(JSON.stringify(localDomTreeSpecs.tableSpec));

    const headNode = getHead({
        inDomTreeSpecs: localDomTreeSpecs,
        inColumns: localColumns
    });

    const bodyNode = getBody({
        inDomTreeSpecs: localDomTreeSpecs,
        inData: localData
    });

    const footerNode = getFooter({
        inDomTreeSpecs: localDomTreeSpecs,
        inColumns: localColumns,
        inData: localData,
        inHasFooterConfig: localHasFooterConfig,
        inFooterConfig: localFooterConfig
    });

    tableSpec.children = [headNode, bodyNode, footerNode].filter(Boolean);

    return tableSpec;
};

export default buildConfiguredTableSpec;

