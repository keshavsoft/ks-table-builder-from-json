import { getHeadRows, getBodyRows, getFooterRows } from "./buildConfiguredTableSpec/index.js";
import buildConfiguredTableSpecInput from "./buildConfiguredTableSpecInput/index.js";

/**
 * Render Task Transformer: Creates and appends the <table> DOM element skeleton during rendering
 */
export const createTableTask = ({
    inShowTable = true,
    inDomTreeSpecs,
    inStore,
    inRendererConfig
} = {}) => {
    const localShowTable = inShowTable !== false;
    const localDomTreeSpecs = inDomTreeSpecs;
    const localStore = inStore;
    const localRendererConfig = inRendererConfig;

    return () => {
        if (!localShowTable) {
            return null;
        }

        const tableSpecInput = buildConfiguredTableSpecInput({
            inDomTreeSpecs: localDomTreeSpecs,
            inStore: localStore,
            inRendererConfig: localRendererConfig
        });

        // Step 1: Build <thead> section element
        const headRows = getHeadRows(tableSpecInput);

        // Step 2: Build <tbody> section element
        const bodyRows = getBodyRows(tableSpecInput);

        // Step 3: Build <tfoot> section element
        const footerRows = getFooterRows(tableSpecInput);
        const tableSpec = JSON.parse(JSON.stringify(localDomTreeSpecs.tableSpec));

        const headRow = tableSpec.children?.find(child => child.tagName === "thead") || { tagName: "thead", children: [] }

        headRow.children = headRows;

        const bodyRow = tableSpec.children?.find(child => child.tagName === "tbody") || { tagName: "tbody", children: [] }

        bodyRow.children = bodyRows;

        const footerRow = tableSpec.children?.find(child => child.tagName === "tfoot") || { tagName: "tfoot", children: [] }

        footerRow.children = footerRows;

        return tableSpec;
    };
};

export default createTableTask;


