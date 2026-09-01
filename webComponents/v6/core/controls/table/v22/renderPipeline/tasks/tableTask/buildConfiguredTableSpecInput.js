import resolveFilteredColumns from "./resolveFilteredColumns.js";

/**
 * Helper: Prepares and returns the structured input object contract expected by buildConfiguredTableSpec
 */
export const buildConfiguredTableSpecInput = ({
    inDomTreeSpecs,
    inStore,
    inRendererConfig
}) => {
    const localDomTreeSpecs = inDomTreeSpecs;
    const localStore = inStore;
    const localRendererConfig = inRendererConfig;

    const requestedKeys = localRendererConfig?.columns || [];
    const hasFooterConfig = Boolean(localRendererConfig && ("footer" in localRendererConfig));
    const footerConfig = localRendererConfig?.footer;

    // Pull data & columnsConfig from store
    const data = localStore?.dataStore?.getOriginalData() || [];
    const columnsConfig = localStore?.columnsStore?.getColumnsConfig() || [];

    // Resolve filtered column metadata objects
    const filteredColumns = resolveFilteredColumns({
        inRequestedKeys: requestedKeys,
        inColumnsConfig: columnsConfig
    });

    return {
        inDomTreeSpecs: localDomTreeSpecs,
        inColumns: filteredColumns,
        inData: data,
        inHasFooterConfig: hasFooterConfig,
        inFooterConfig: footerConfig
    };
};

export default buildConfiguredTableSpecInput;
