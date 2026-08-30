import buildSpecElement from "../../../../../domCreation/v2/buildSpecElement.js";
import defaultGodSpec from "../tableGodSpec.json" with { type: "json" };
import resolveThemeSpec from "../themes/index.js";
import applyTheme from "./applyTheme.js";

/**
 * Layer 1: Table v11 Skeleton Render
 * Builds the structural DOM Toolbar + <table> shell from tableGodSpec.json template.
 * Applies resolved theme class overrides (by theme name or spec) to inSpec before rendering.
 */
export const renderSkeleton = ({ inSpec, inTheme, inThemeName, inThemeSpec }) => {
    const localSpec = inSpec || defaultGodSpec;
    const resolvedThemeSpec = resolveThemeSpec({ inTheme, inThemeName, inThemeSpec });

    const resolvedSpec = resolvedThemeSpec
        ? applyTheme({ inSpec: localSpec, inThemeSpec: resolvedThemeSpec })
        : localSpec;

    // Build DOM tree skeleton for table & toolbar
    const skeletonElement = buildSpecElement(resolvedSpec);
    return skeletonElement;
};

export default renderSkeleton;
