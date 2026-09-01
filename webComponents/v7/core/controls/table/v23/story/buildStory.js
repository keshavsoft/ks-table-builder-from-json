import { buildRenderPipeline } from "../renderPipeline/index.js";
import buildDataStore from "./dataStore/index.js";

/**
 * Story Builder: Resolves component render pipeline and store buckets
 */
export const buildStory = ({
    domTreeJsonFiles,
    inVisibility = {},
    inPipeline = {},
    columnsConfig,
    renderers,
    data
} = {}) => {
    const localPipelineObj = typeof inPipeline === "object" && inPipeline !== null ? inPipeline : {};
    const rawRenderPipeline = localPipelineObj.inRenderPipeline || localPipelineObj.renderPipeline || inPipeline;
    const localColumnsConfig = columnsConfig || [];
    const localData = data || [];

    // Step 1: Build Store FIRST
    const store = buildDataStore({
        inData: localData,
        inColumnsConfig: localColumnsConfig
    });

    // Step 2: Pass store into buildRenderPipeline
    const renderPipeline = Array.isArray(rawRenderPipeline) && rawRenderPipeline.length > 0
        ? rawRenderPipeline
        : buildRenderPipeline({
            domTreeJsonFiles,
            inShowSearch: inVisibility?.showSearch,
            inShowTable: inVisibility?.showTable,
            inStore: store,
            inRenderers: renderers
        });

    return {
        renderPipeline,
        store
    };
};

export default buildStory;
