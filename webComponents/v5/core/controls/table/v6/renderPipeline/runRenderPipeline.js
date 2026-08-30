/**
 * Executes a pipeline array of render-level DOM task functions sequentially
 */
export const runRenderPipeline = ({ inContext, inPipeline = [] }) => {
    let localContext = inContext;
    const localPipeline = inPipeline;

    for (const task of localPipeline) {
        if (typeof task === "function") {
            localContext = task({ inContext: localContext }) || localContext;
        }
    }

    return localContext;
};

export default runRenderPipeline;
