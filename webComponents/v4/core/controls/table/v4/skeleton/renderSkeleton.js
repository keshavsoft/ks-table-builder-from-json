import buildSpecElement from "../../../../../domCreation/v2/buildSpecElement.js";
import defaultGodSpec from "../tableGodSpec.json" with { type: "json" };
import resolveThemeSpec from "../themes/index.js";
import applySpecPipeline from "../specTransform/pipeline.js";

/**
 * Layer 1: Table Skeleton Render
 * Runs modular spec transformation pipeline outside, then constructs DOM elements via buildSpecElement.
 */
export const renderSkeleton = ({
    inSpec,
    inTheme,
    inThemeName,
    inThemeSpec,
    inShowSerial = true,
    inShowHeader = true,
    inShowBody = true,
    inShowFooter = true
}) => {
    const localSpec = inSpec || defaultGodSpec;
    const localShowSerial = inShowSerial !== false;
    const localShowHeader = inShowHeader !== false;
    const localShowBody = inShowBody !== false;
    const localShowFooter = inShowFooter !== false;

    const resolvedThemeSpec = resolveThemeSpec({ inTheme, inThemeName, inThemeSpec });

    // Execute modular spec transformation pipeline (Theme -> Sections -> Serial Column)
    const resolvedSpec = applySpecPipeline({
        inSpec: localSpec,
        inThemeSpec: resolvedThemeSpec,
        inShowHeader: localShowHeader,
        inShowBody: localShowBody,
        inShowFooter: localShowFooter,
        inShowSerial: localShowSerial
    });

    // Build DOM tree skeleton for table & toolbar from transformed Spec
    const skeletonElement = buildSpecElement(resolvedSpec);
    return skeletonElement;
};

export default renderSkeleton;
