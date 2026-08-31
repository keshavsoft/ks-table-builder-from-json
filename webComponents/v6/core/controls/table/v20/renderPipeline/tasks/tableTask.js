// import domTreeJsonFiles from "../../domTreeJsonFiles/index.js";

/**
 * Render Task Transformer: Creates and appends the <table> DOM element skeleton during rendering
 */
export const createTableTask = ({
    inShowTable = true,
    domTreeJsonFiles
} = {}) => {
    const localShowTable = inShowTable !== false;

    return () => {
        if (localShowTable) {
            return domTreeJsonFiles.tableSpec;
        };

        return null;
    };
};

export default createTableTask;
