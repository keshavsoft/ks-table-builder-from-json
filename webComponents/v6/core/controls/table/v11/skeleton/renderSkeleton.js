import buildSpecElement from "../../../../../domCreation/v2/buildSpecElement.js";
import tableLayoutSpec from "../tableLayoutSpec.json" with { type: "json" };

/**
 * Layer 1: Layout Skeleton Render
 * Builds and returns the outer layout shell DOM element from tableLayoutSpec.
 */
export const renderSkeleton = ({ inSpec } = {}) => {
    const localSpec = inSpec || tableLayoutSpec;

    // Build outer layout DOM skeleton
    const skeletonElement = buildSpecElement(localSpec);
    return skeletonElement;
};

export default renderSkeleton;

