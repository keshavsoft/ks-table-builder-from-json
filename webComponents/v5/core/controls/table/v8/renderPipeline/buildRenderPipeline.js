import createSearchTask from "./tasks/searchTask.js";

/**
 * Builds dynamic array of render component pipeline task functions
 */
export const buildRenderPipeline = ({
    inShowSearch = true,
    inCustomTasks = []
} = {}) => {
    const localShowSearch = inShowSearch;
    const localCustomTasks = inCustomTasks;

    const pipeline = [];

    // Render Task 1: Search Component Task (Toggles search input DOM element)
    pipeline.push(createSearchTask({ inShowSearch: localShowSearch }));

    // External Custom Render Task Functions (e.g. searchNewTask, paginationTask)
    if (Array.isArray(localCustomTasks) && localCustomTasks.length > 0) {
        pipeline.push(...localCustomTasks);
    }

    return pipeline;
};

export default buildRenderPipeline;
