import { runRenderPipeline } from "./renderPipeline/index.js";

import resolveTableOptions from "./options/resolveTableOptions.js";
import domCreationFuncs from "../../../../domCreation/index.js";
import getActiveDomTreeSpecs from "./getActiveDomTreeSpecs.js";

console.log("22");

export const renderTable = (inOptions = {}) => {
    const localOptions = inOptions;

    // Resolve theme name from options
    const themeName = localOptions.theme ? localOptions.theme : "light";

    // Map theme classes from getThemeSpecs onto domTreeJsonFiles base specs
    const activeDomTreeSpecs = getActiveDomTreeSpecs({ inThemeName: themeName });

    // Step 1: Resolve & normalize configuration options
    const options = resolveTableOptions({
        domTreeJsonFiles: activeDomTreeSpecs,
        ...localOptions
    });
    console.log("options---------", options);
    // Step 2: Layer 1b - Execute Render Component Pipeline
    const childrenNodes = runRenderPipeline({
        inPipeline: options.renderPipeline
    });

    const localRootSpec = activeDomTreeSpecs.root;

    localRootSpec.children.push(...childrenNodes);

    const domElement = domCreationFuncs.versions[domCreationFuncs.maxVersion](localRootSpec);

    return domElement;
};

export { getActiveDomTreeSpecs };
export default renderTable;