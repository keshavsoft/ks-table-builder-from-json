import { runRenderPipeline } from "./renderPipeline/index.js";
import buildStory from "./story/index.js";
import domCreationFuncs from "../../../../domCreation/index.js";
import getActiveDomTreeSpecs from "./getActiveDomTreeSpecs.js";
import buildBody from "./renderPipeline/tasks/tableTask/v2/buildConfiguredTableSpec/body/index.js";
import prepareTableData from "./renderPipeline/tasks/tableTask/v2/buildConfiguredTableSpecInput/prepareTableData.js";
import resolveFilteredColumns from "./renderPipeline/tasks/tableTask/v2/buildConfiguredTableSpecInput/resolveFilteredColumns.js";

console.log("24");

const filterData = ({ inData, inQuery }) => {
    const localData = Array.isArray(inData) ? inData : [];
    const localQuery = (inQuery || "").toLowerCase().trim();

    if (!localQuery) {
        return localData;
    }

    return localData.filter(row =>
        Object.values(row || {}).some(val =>
            String(val ?? "").toLowerCase().includes(localQuery)
        )
    );
};

const hookSearch = ({ inStory, inDomTreeSpecs, inOptions }) => {
    const localStory = inStory;
    const localDomTreeSpecs = inDomTreeSpecs;
    const localOptions = inOptions || {};
    const tableSearchInput = document.getElementById("tableSearchInput");

    if (!tableSearchInput) return;

    tableSearchInput.addEventListener("input", (e) => {
        const rawData = localStory.store.dataStore.getOriginalData();
        const currentTargetValue = e.currentTarget.value;

        // Step 1: Filter raw data
        const filteredData = filterData({
            inData: rawData,
            inQuery: currentTargetValue
        });

        // Step 2: Update renderer-scoped table store
        localStory.renderersStore?.table?.store?.dataStore?.setFilteredData({ inData: filteredData });

        // Step 3: Get target tbody DOM element from table container
        const tableContainer = document.getElementById("tableContainer");
        const tableBody = tableContainer ? tableContainer.querySelector("tbody") : document.querySelector("tbody");
        if (!tableBody) return;

        // Step 4: Resolve active columns & prepare row data
        const tableStore = localStory.renderersStore?.table?.store;
        const columnsConfig = tableStore?.columnsStore?.getColumnsConfig() || localOptions.columnsConfig || [];
        const requestedKeys = localOptions.renderers?.table?.columns || [];

        let filteredColumns = [];
        if (Array.isArray(requestedKeys) && requestedKeys.length > 0) {
            filteredColumns = resolveFilteredColumns({
                inRequestedKeys: requestedKeys,
                inColumnsConfig: columnsConfig
            });
        } else {
            filteredColumns = columnsConfig;
        }

        const preparedData = prepareTableData({
            inData: filteredData,
            inColumns: filteredColumns
        });

        // Step 5: Build tbody row specs
        const bodyRowsSpec = buildBody({
            inData: preparedData,
            inTrSpec: localDomTreeSpecs.trSpec,
            inTdSpec: localDomTreeSpecs.tdSpec
        });

        // Step 6: Create tbody JSON spec using activeDomTreeSpecs template
        const tbodyBaseSpec = localDomTreeSpecs.tableSpec.children?.find(child => child.tagName === "tbody") || { tagName: "tbody" };
        const newTbodySpec = {
            ...tbodyBaseSpec,
            children: bodyRowsSpec
        };

        // Step 7: Convert spec to DOM Node & repaint!
        const newTbodyNode = domCreationFuncs.versions[domCreationFuncs.maxVersion](newTbodySpec);
        tableBody.replaceWith(newTbodyNode);
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

    console.log("story : ", story);

    // Step 2: Layer 1b - Execute Render Component Pipeline
    const childrenNodes = runRenderPipeline({
        inPipeline: story.renderPipeline
    });

    const localRootSpec = { ...activeDomTreeSpecs.root };

    localRootSpec.children.push(...childrenNodes);

    const domElement = domCreationFuncs.versions[domCreationFuncs.maxVersion](localRootSpec);

    const tableContainer = document.getElementById("tableContainer");
    if (tableContainer) {
        tableContainer.appendChild(domElement);
    }

    hookSearch({
        inStory: story,
        inDomTreeSpecs: activeDomTreeSpecs,
        inOptions: localOptions
    });

    return domElement;
};

export default renderTable;