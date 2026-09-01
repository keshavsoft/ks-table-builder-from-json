import buildConfiguredTableSpec from "./buildConfiguredTableSpec.js";

/**
 * Render Task Transformer: Creates and appends the <table> DOM element skeleton during rendering
 */
export const createTableTask = ({
    inShowTable = true,
    domTreeJsonFiles,
    inStore,
    inRendererConfig
} = {}) => {
    const localShowTable = inShowTable !== false;
    const localDomTreeSpecs = domTreeJsonFiles;
    const localStore = inStore;
    const localRendererConfig = inRendererConfig;

    console.log("tableTask localStore:", localStore);

    return () => {
        if (!localShowTable) {
            return null;
        }

        const columns = localRendererConfig?.columns || [];
        const hasFooterConfig = Boolean(localRendererConfig && ("footer" in localRendererConfig));
        const footerConfig = localRendererConfig?.footer;

        const data = localStore?.dataStore?.getOriginalData() || [];

        return buildConfiguredTableSpec({
            inDomTreeSpecs: localDomTreeSpecs,
            inColumns: columns,
            inData: data,
            inHasFooterConfig: hasFooterConfig,
            inFooterConfig: footerConfig
        });
    };
};

export default createTableTask;
