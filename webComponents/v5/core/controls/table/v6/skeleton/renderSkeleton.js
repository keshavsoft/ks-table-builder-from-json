import buildSpecElement from "../../../../../domCreation/v2/buildSpecElement.js";
import defaultGodSpec from "../tableGodSpec.json" with { type: "json" };
import resolveThemeSpec from "../themes/index.js";
import { runPipeline, buildTablePipeline } from "../specTransform/index.js";

/**
 * Layer 1: Table Skeleton Render
 * Runs modular pipeline array of single-task spec transformers, then mounts live DOM elements via buildSpecElement.
 */
export const renderSkeleton = ({
    inSpec,
    inTheme,
    inThemeName,
    inThemeSpec,
    inShowSerial = true,
    inShowHeader = true,
    inShowBody = true,
    inShowFooter = true,
    inPipeline
}) => {
    const localSpec = inSpec || defaultGodSpec;
    const localShowSerial = inShowSerial !== false;
    const localShowHeader = inShowHeader !== false;
    const localShowBody = inShowBody !== false;
    const localShowFooter = inShowFooter !== false;
    
    const resolvedThemeSpec = resolveThemeSpec({ inTheme, inThemeName, inThemeSpec });

    // Build pipeline array of task functions or use custom inPipeline
    const pipeline = Array.isArray(inPipeline) && inPipeline.length > 0
        ? inPipeline
        : buildTablePipeline({
            inThemeSpec: resolvedThemeSpec,
            inShowHeader: localShowHeader,
            inShowBody: localShowBody,
            inShowFooter: localShowFooter,
            inShowSerial: localShowSerial
        });

    // Execute the spec pipeline!
    const resolvedSpec = runPipeline({
        inSpec: localSpec,
        inPipeline: pipeline
    });

    // Build DOM tree skeleton for table & toolbar from transformed Spec
    const skeletonElement = buildSpecElement(resolvedSpec);
    return skeletonElement;
};

export default renderSkeleton;
