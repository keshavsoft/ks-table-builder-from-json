import { runRenderPipeline } from "./renderPipeline/index.js";
import resolveTableOptions from "./options/resolveTableOptions.js";
import domCreationFuncs from "../../../../domCreation/index.js";

import domRootSpec from "./domTreeJsonFiles/specs/root.json" with { type: "json" };

export const renderTable = (inOptions = {}) => {
    const localOptions = inOptions;

    // Step 1: Resolve & normalize configuration options
    const options = resolveTableOptions({
        ...localOptions
    });

    // Step 2: Layer 1b - Execute Render Component Pipeline
    const childrenNodes = runRenderPipeline({
        inPipeline: options.renderPipeline
    });

    domRootSpec.children.push(...childrenNodes);

    const domElement = domCreationFuncs.versions[domCreationFuncs.maxVersion](domRootSpec);

    return domElement;
};

export default renderTable;