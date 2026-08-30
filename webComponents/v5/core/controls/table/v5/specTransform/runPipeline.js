/**
 * Generic Spec Transformation Pipeline Runner
 * Sequentially executes an array of transformer task functions over a JSON Spec object
 */
export const runPipeline = ({ inSpec, inPipeline = [] }) => {
    return (inPipeline || []).reduce((currentSpec, taskFn) => {
        if (typeof taskFn === "function") {
            return taskFn({ inSpec: currentSpec });
        }
        return currentSpec;
    }, inSpec);
};

export default runPipeline;
