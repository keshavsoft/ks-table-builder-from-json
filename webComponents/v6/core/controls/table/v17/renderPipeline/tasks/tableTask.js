import tableSpec from "./tableSpec.json" with { type: "json" };

/**
 * Render Task Transformer: Creates and appends the <table> DOM element skeleton during rendering
 */
export const createTableTask = ({
    inShowTable = true
} = {}) => {
    const localShowTable = inShowTable !== false;

    return () => {
        if (localShowTable) {

            return tableSpec;
        };

        return null;
    };
};

export default createTableTask;
