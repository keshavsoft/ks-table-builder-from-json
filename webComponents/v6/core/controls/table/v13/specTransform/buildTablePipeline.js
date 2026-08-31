import { createApplyThemeTask } from "./tasks/applyThemeTask.js";
import { createHeaderTask } from "./tasks/headerTask.js";
import { createBodyTask } from "./tasks/bodyTask.js";
import { createFooterTask } from "./tasks/footerTask.js";
import { createSerialTask } from "./tasks/serialTask.js";

/**
 * Builds a dynamic array of spec transformation task functions based on table options
 */
export const buildTablePipeline = ({
    inThemeSpec,
    inShowHeader = true,
    inShowBody = true,
    inShowFooter = true,
    inShowSerial = true,
    inCustomTasks = []
}) => {
    const pipeline = [];

    // Task 1: Theme Transformer
    if (inThemeSpec) {
        pipeline.push(createApplyThemeTask({ inThemeSpec }));
    };

    // Task 2: Header Visibility Transformer (<thead />)
    pipeline.push(createHeaderTask({ inShowHeader }));

    // Task 3: Body Visibility Transformer (<tbody />)
    pipeline.push(createBodyTask({ inShowBody }));

    // Task 4: Footer Visibility Transformer (<tfoot />)
    pipeline.push(createFooterTask({ inShowFooter }));

    // Task 5: Serial Column Transformer (#)
    pipeline.push(createSerialTask({ inShowSerial }));

    // Task 6: External Custom Task Functions
    if (Array.isArray(inCustomTasks) && inCustomTasks.length > 0) {
        pipeline.push(...inCustomTasks);
    }

    return pipeline;
};

export default buildTablePipeline;
