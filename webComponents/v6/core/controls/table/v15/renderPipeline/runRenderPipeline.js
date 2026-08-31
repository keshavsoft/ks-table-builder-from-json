/**
 * Executes a pipeline array of render-level DOM task functions sequentially
 */
export const runRenderPipeline = ({ inContext, inPipeline = [] }) => {
    const localContext = inContext || {};
    const skeletonElement = localContext.inSkeletonElement;
    const localPipeline = inPipeline;

    for (const task of localPipeline) {
        if (typeof task === "function") {
            const componentElement = task();

            if (componentElement instanceof Node && skeletonElement instanceof Node) {
                skeletonElement.appendChild(componentElement);
            }
        }
    }

    return localContext;
};

export default runRenderPipeline;
