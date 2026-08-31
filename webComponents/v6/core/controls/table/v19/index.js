import { runRenderPipeline } from "./renderPipeline/index.js";
import resolveTableOptions from "./options/resolveTableOptions.js";
import domCreationFuncs from "../../../../domCreation/index.js";
import domTreeJsonFiles from "./domTreeJsonFiles/index.js";
import getThemeSpecs from "./domTreeJsonFiles/themes/index.js";

console.log("19");

/**
 * Recursively maps theme classes from themeSpec onto baseSpec tree
 */
export const applyThemeToSpec = ({ inSpec, inThemeSpec } = {}) => {
    const localSpec = inSpec;
    const localThemeSpec = inThemeSpec;

    if (!localSpec || typeof localSpec !== "object") {
        return localSpec;
    }

    const clonedSpec = JSON.parse(JSON.stringify(localSpec));

    if (!localThemeSpec || typeof localThemeSpec !== "object") {
        return clonedSpec;
    }

    const mergeNodeClasses = (baseNode, themeNode) => {
        if (!baseNode || !themeNode) return;

        if (themeNode.attributes && themeNode.attributes.class !== undefined) {
            baseNode.attributes = baseNode.attributes || {};
            baseNode.attributes.class = themeNode.attributes.class;
        }

        if (Array.isArray(baseNode.children) && Array.isArray(themeNode.children)) {
            const minLength = Math.min(baseNode.children.length, themeNode.children.length);
            for (let i = 0; i < minLength; i++) {
                mergeNodeClasses(baseNode.children[i], themeNode.children[i]);
            }
        }
    };

    mergeNodeClasses(clonedSpec, localThemeSpec);

    return clonedSpec;
};

export const renderTable = (inOptions = {}) => {
    const localOptions = inOptions;

    // Resolve theme name from options
    let themeName = "light";
    if (typeof localOptions.theme === "string" && localOptions.theme.trim() !== "") {
        themeName = localOptions.theme;
    } else if (typeof localOptions.inTheme === "string" && localOptions.inTheme.trim() !== "") {
        themeName = localOptions.inTheme;
    } else if (typeof localOptions.inTheme === "object" && localOptions.inTheme !== null) {
        themeName = localOptions.inTheme.inTheme || localOptions.inTheme.theme || "light";
    } else if (typeof localOptions.theme === "object" && localOptions.theme !== null) {
        themeName = localOptions.theme.inTheme || localOptions.theme.theme || "light";
    }

    // Get theme specs for resolved theme
    const themeSpecs = getThemeSpecs({ inTheme: themeName });

    // Map theme classes from getThemeSpecs onto domTreeJsonFiles base specs
    const activeDomTreeSpecs = {
        root: applyThemeToSpec({ inSpec: domTreeJsonFiles.root, inThemeSpec: themeSpecs?.root }),
        searchSpec: applyThemeToSpec({ inSpec: domTreeJsonFiles.searchSpec, inThemeSpec: themeSpecs?.search }),
        tableSpec: applyThemeToSpec({ inSpec: domTreeJsonFiles.tableSpec, inThemeSpec: themeSpecs?.table })
    };

    // Step 1: Resolve & normalize configuration options
    const options = resolveTableOptions({
        domTreeJsonFiles: activeDomTreeSpecs,
        ...localOptions
    });

    // Step 2: Layer 1b - Execute Render Component Pipeline
    const childrenNodes = runRenderPipeline({
        inPipeline: options.renderPipeline
    });

    const localRootSpec = activeDomTreeSpecs.root;

    localRootSpec.children.push(...childrenNodes);

    const domElement = domCreationFuncs.versions[domCreationFuncs.maxVersion](localRootSpec);

    return domElement;
};

export default renderTable;