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

    const renderPipeline = Array.isArray(rawRenderPipeline) && rawRenderPipeline.length > 0
        ? rawRenderPipeline
        : buildRenderPipeline({
            domTreeJsonFiles,
            inShowSearch: inVisibility?.showSearch,
            inShowTable: inVisibility?.showTable,
            inRenderers: renderers,
            inData: localData
        });

    const store = buildDataStore({
        inData: localData,
        inColumnsConfig: localColumnsConfig
    });

    return {
        renderPipeline,
        store
    };
};

export default buildStory;
