import { buildRenderPipeline } from "../renderPipeline/index.js";

/**
 * Resolves and normalizes grouped table options into structured responsibility buckets
 */
export const resolveTableOptions = ({
    // Grouped Responsibility Objects
    inTable = {},
    inTheme = {},
    inVisibility = {},
    inEvents = {},
    inPipeline = {},

    // Flat Fallback Parameters (Backward Compatibility)
    inSpec,
    inThemeName,
    inThemeSpec,
    inRows,
    inHeaders,
    inColumns,
    inOnRowClick,
    inOnSearch,
    inShowSerial,
    inShowSearch,
    inShowHeader,
    inShowBody,
    inShowFooter,
    inRenderPipeline,
    ...restFlatOptions
} = {}) => {
    // 1. Resolve Table / Data Config
    const localTable = typeof inTable === "object" && inTable !== null ? inTable : {};
    const rows = localTable.inRows || localTable.rows || inRows || restFlatOptions.inRows || [];
    const headers = localTable.inHeaders || localTable.headers || localTable.inColumns || localTable.columns || inHeaders || inColumns || restFlatOptions.inHeaders || restFlatOptions.inColumns;

    // 2. Resolve Theme / Spec Config
    const localThemeObj = typeof inTheme === "object" && inTheme !== null ? inTheme : { inTheme: inTheme };
    const spec = localThemeObj.inSpec || localThemeObj.spec || inSpec || restFlatOptions.inSpec;
    const theme = localThemeObj.inTheme || localThemeObj.theme || (typeof inTheme === "string" ? inTheme : undefined);
    const themeName = localThemeObj.inThemeName || localThemeObj.themeName || inThemeName || restFlatOptions.inThemeName;
    const themeSpec = localThemeObj.inThemeSpec || localThemeObj.themeSpec || inThemeSpec || restFlatOptions.inThemeSpec;

    // 3. Resolve Visibility Toggles Config
    const localVisibility = typeof inVisibility === "object" && inVisibility !== null ? inVisibility : {};
    const getToggle = (groupVal, flatVal, defaultVal = true) => {
        if (groupVal !== undefined) return groupVal !== false;
        if (flatVal !== undefined) return flatVal !== false;
        return defaultVal;
    };

    const showSerial = getToggle(localVisibility.inShowSerial ?? localVisibility.showSerial, inShowSerial);
    const showSearch = getToggle(localVisibility.inShowSearch ?? localVisibility.showSearch, inShowSearch);
    const showHeader = getToggle(localVisibility.inShowHeader ?? localVisibility.showHeader, inShowHeader);
    const showBody = getToggle(localVisibility.inShowBody ?? localVisibility.showBody, inShowBody);
    const showFooter = getToggle(localVisibility.inShowFooter ?? localVisibility.showFooter, inShowFooter);

    // 4. Resolve Events Config
    const localEvents = typeof inEvents === "object" && inEvents !== null ? inEvents : {};
    const onRowClick = localEvents.inOnRowClick || localEvents.onRowClick || inOnRowClick || restFlatOptions.inOnRowClick;
    const onSearch = localEvents.inOnSearch || localEvents.onSearch || inOnSearch || restFlatOptions.inOnSearch;

    // 5. Resolve Pipeline Config
    const localPipelineObj = typeof inPipeline === "object" && inPipeline !== null ? inPipeline : {};
    const rawRenderPipeline = localPipelineObj.inRenderPipeline || localPipelineObj.renderPipeline || inRenderPipeline || restFlatOptions.inRenderPipeline;

    const renderPipeline = Array.isArray(rawRenderPipeline) && rawRenderPipeline.length > 0
        ? rawRenderPipeline
        : buildRenderPipeline({ inShowSearch: showSearch });

    return {
        table: { rows, headers },
        theme: { spec, theme, themeName, themeSpec },
        visibility: { showSerial, showSearch, showHeader, showBody, showFooter },
        events: { onRowClick, onSearch },
        pipeline: { renderPipeline },

        // Flattened accessors for orchestrator convenience
        rows,
        headers,
        onRowClick,
        onSearch,
        showSerial,
        showSearch,
        showHeader,
        showBody,
        showFooter,
        renderPipeline,
        skeletonOptions: {
            inSpec: spec,
            inTheme: theme,
            inThemeName: themeName,
            inThemeSpec: themeSpec,
            inShowSerial: showSerial,
            inShowHeader: showHeader,
            inShowBody: showBody,
            inShowFooter: showFooter
        }
    };
};

export default resolveTableOptions;
