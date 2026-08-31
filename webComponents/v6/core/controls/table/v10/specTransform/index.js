import runPipeline from "./runPipeline.js";
import buildTablePipeline from "./buildTablePipeline.js";

import createApplyThemeTask from "./tasks/applyThemeTask.js";
import createHeaderTask from "./tasks/headerTask.js";
import createBodyTask from "./tasks/bodyTask.js";
import createFooterTask from "./tasks/footerTask.js";
import createSerialTask from "./tasks/serialTask.js";

export {
    runPipeline,
    buildTablePipeline,
    createApplyThemeTask,
    createHeaderTask,
    createBodyTask,
    createFooterTask,
    createSerialTask
};

export default runPipeline;
