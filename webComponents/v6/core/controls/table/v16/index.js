import { runRenderPipeline, buildRenderPipeline } from "./renderPipeline/index.js";
import resolveTableOptions from "./options/resolveTableOptions.js";
import domCreationFuncs from "../../../../domCreation/index.js";

import tableLayoutSpec from "./tableLayoutSpec.json" with { type: "json" };
console.log("16666666666");

export const renderTable = (inOptions = {}) => {
    const localOptions = inOptions;

    // Step 1: Resolve & normalize configuration options
    const options = resolveTableOptions({
        ...localOptions
    });

    // Step 2: Layer 1b - Execute Render Component Pipeline
    const k1 = runRenderPipeline({
        inPipeline: options.renderPipeline
    });

    tableLayoutSpec.children.push(...k1);

    const k2 = domCreationFuncs.versions[domCreationFuncs.maxVersion](tableLayoutSpec);

    return k2;
};

export default renderTable;