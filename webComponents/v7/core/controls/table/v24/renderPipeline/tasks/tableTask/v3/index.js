import { getHead, getBody, getFooter } from "./buildConfiguredTableSpec/index.js";
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
        const headNode = getHead(tableSpecInput);

        // Step 2: Build <tbody> section element
        const bodyNode = getBody(tableSpecInput);

        // Step 3: Build <tfoot> section element
        const footerNode = getFooter(tableSpecInput);
        const tableSpec = JSON.parse(JSON.stringify(localDomTreeSpecs.tableSpec));

        tableSpec.children = [headNode, bodyNode, footerNode].filter(Boolean);

        return tableSpec;
    };
};

export default createTableTask;


