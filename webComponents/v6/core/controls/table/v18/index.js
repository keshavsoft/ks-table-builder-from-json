import { runRenderPipeline } from "./renderPipeline/index.js";
import resolveTableOptions from "./options/resolveTableOptions.js";
import domCreationFuncs from "../../../../domCreation/index.js";
// import domTreeJsonFiles from "./domTreeJsonFiles/index.js";
import domTreeJsonFiles from "./domTreeJsonFiles/index.js";
// console.log("18");

export const renderTable = (inOptions = {}) => {
    const localOptions = inOptions;

    // Step 1: Resolve & normalize configuration options
    const options = resolveTableOptions({
        domTreeJsonFiles,
        ...localOptions
    });

    // Step 2: Layer 1b - Execute Render Component Pipeline
    const childrenNodes = runRenderPipeline({
        inPipeline: options.renderPipeline
    });

    const localRootSpec = JSON.parse(JSON.stringify(domTreeJsonFiles.root));

    localRootSpec.children.push(...childrenNodes);

    const domElement = domCreationFuncs.versions[domCreationFuncs.maxVersion](localRootSpec);

    return domElement;
};

export default renderTable;