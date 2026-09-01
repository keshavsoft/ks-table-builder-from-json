import { runRenderPipeline } from "./renderPipeline/index.js";
import buildStory from "./story/index.js";
import domCreationFuncs from "../../../../domCreation/index.js";
import getActiveDomTreeSpecs from "./getActiveDomTreeSpecs.js";

console.log("23");

const hookSearch = ({ inStory }) => {

    const tableSearchInput = document.getElementById("tableSearchInput");

    tableSearchInput.addEventListener('keydown', (e) => {
        const data = inStory.store.dataStore.getOriginalData();
        console.log("a : ", data);

        const currentTarget = e.currentTarget;
        const currentTargetValue = currentTarget.value;

        console.log("currentTargetValue : ", currentTargetValue);
    });
};

export const renderTable = (inOptions = {}) => {
    const localOptions = inOptions;

    // Resolve theme name from options
    const themeName = localOptions.theme ? localOptions.theme : "light";

    // Map theme classes from getThemeSpecs onto domTreeJsonFiles base specs
    const activeDomTreeSpecs = getActiveDomTreeSpecs({ inThemeName: themeName });

    // Step 1: Build story (pipeline & store)
    const story = buildStory({
        domTreeJsonFiles: activeDomTreeSpecs,
        ...localOptions
    });

    // Step 2: Layer 1b - Execute Render Component Pipeline
    const childrenNodes = runRenderPipeline({
        inPipeline: story.renderPipeline
    });

    const localRootSpec = { ...activeDomTreeSpecs.root };

    localRootSpec.children.push(...childrenNodes);
    console.log("localRootSpec : ", localRootSpec);

    const domElement = domCreationFuncs.versions[domCreationFuncs.maxVersion](localRootSpec);

    const tableContainer = document.getElementById("tableContainer");
    tableContainer.appendChild(domElement);

    hookSearch({ inStory: story });

    return domElement;
};

export const renderTable1 = (inOptions = {}) => {
    const localOptions = inOptions;

    // Resolve theme name from options
    const themeName = localOptions.theme ? localOptions.theme : "light";

    // Map theme classes from getThemeSpecs onto domTreeJsonFiles base specs
    const activeDomTreeSpecs = getActiveDomTreeSpecs({ inThemeName: themeName });

    // Step 1: Build story (pipeline & store)
    const story = buildStory({
        domTreeJsonFiles: activeDomTreeSpecs,
        ...localOptions
    });

    // Step 2: Layer 1b - Execute Render Component Pipeline
    const childrenNodes = runRenderPipeline({
        inPipeline: story.renderPipeline
    });
    console.log("story : ", story, activeDomTreeSpecs.root);

    const localRootSpec = activeDomTreeSpecs.root;

    localRootSpec.children.push(...childrenNodes);

    const domElement = domCreationFuncs.versions[domCreationFuncs.maxVersion](localRootSpec);

    return domElement;
};

export const renderTable2 = (inOptions = {}) => {
    const localOptions = inOptions;

    // Resolve theme name from options
    const themeName = localOptions.theme ? localOptions.theme : "light";

    // Map theme classes from getThemeSpecs onto domTreeJsonFiles base specs
    const activeDomTreeSpecs = getActiveDomTreeSpecs({ inThemeName: themeName });

    const localRootSpec = activeDomTreeSpecs.root;
    console.log("localRootSpec : ", activeDomTreeSpecs, localRootSpec);
    const domElement = domCreationFuncs.versions[domCreationFuncs.maxVersion](localRootSpec);

    return domElement;
};

export default renderTable;