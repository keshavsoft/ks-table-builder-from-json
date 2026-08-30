import { buildRenderPipeline } from "../renderPipeline/index.js";

/**
 * Resolves and normalizes input options for table rendering with default values
 */
export const resolveTableOptions = ({
    inSpec,
    inTheme,
    inThemeName,
    inThemeSpec,
    inRows,
    inHeaders,
    inColumns,
    inOnRowClick,
    inOnSearch,
    inShowSerial = true,
    inShowSearch = true,
    inShowHeader = true,
    inShowBody = true,
    inShowFooter = true,
    inRenderPipeline
} = {}) => {
    const localSpec = inSpec;
    const localTheme = inTheme;
    const localThemeName = inThemeName;
    const localThemeSpec = inThemeSpec;
    const localRows = inRows || [];
    const localHeaders = inHeaders || inColumns;
    const localOnRowClick = inOnRowClick;
    const localOnSearch = inOnSearch;
    const localShowSerial = inShowSerial !== false;
    const localShowSearch = inShowSearch !== false;
    const localShowHeader = inShowHeader !== false;
    const localShowBody = inShowBody !== false;
    const localShowFooter = inShowFooter !== false;
    const localRenderPipeline = inRenderPipeline;

    const renderPipeline = Array.isArray(localRenderPipeline) && localRenderPipeline.length > 0
        ? localRenderPipeline
        : buildRenderPipeline({ inShowSearch: localShowSearch });

    return {
        rows: localRows,
        headers: localHeaders,
        onRowClick: localOnRowClick,
        onSearch: localOnSearch,
        showSerial: localShowSerial,
        showSearch: localShowSearch,
        showHeader: localShowHeader,
        showBody: localShowBody,
        showFooter: localShowFooter,
        renderPipeline,
        skeletonOptions: {
            inSpec: localSpec,
            inTheme: localTheme,
            inThemeName: localThemeName,
            inThemeSpec: localThemeSpec,
            inShowSerial: localShowSerial,
            inShowHeader: localShowHeader,
            inShowBody: localShowBody,
            inShowFooter: localShowFooter
        }
    };
};

export default resolveTableOptions;
