// import buildSpecElement from "../../../../../../domCreation/v2/buildSpecElement.js";
import tableSpec from "./tableSpec.json" with { type: "json" };
import resolveThemeSpec from "../../themes/index.js";
import { runPipeline, buildTablePipeline } from "../../specTransform/index.js";

/**
 * Render Task Transformer: Creates and appends the <table> DOM element skeleton during rendering
 */
export const createTableTask = ({
    inShowTable = true,
    inSpec,
    inTheme,
    inThemeName,
    inThemeSpec,
    inShowSerial = true,
    inShowHeader = true,
    inShowBody = true,
    inShowFooter = true,
    inPipeline,
    inDomCreationFuncs
} = {}) => {
    const localShowTable = inShowTable !== false;
    const localSpec = inSpec || tableSpec;
    const localTheme = inTheme;
    const localThemeName = inThemeName;
    const localThemeSpec = inThemeSpec;
    const localShowSerial = inShowSerial !== false;
    const localShowHeader = inShowHeader !== false;
    const localShowBody = inShowBody !== false;
    const localShowFooter = inShowFooter !== false;
    const localPipeline = inPipeline;
    const localDomCreationFuncs = inDomCreationFuncs;

    return () => {
        if (localShowTable) {
            const resolvedThemeSpec = resolveThemeSpec({
                inTheme: localTheme,
                inThemeName: localThemeName,
                inThemeSpec: localThemeSpec
            });

            const pipeline = Array.isArray(localPipeline) && localPipeline.length > 0
                ? localPipeline
                : buildTablePipeline({
                    inThemeSpec: resolvedThemeSpec,
                    inShowHeader: localShowHeader,
                    inShowBody: localShowBody,
                    inShowFooter: localShowFooter,
                    inShowSerial: localShowSerial
                });

            const resolvedSpec = runPipeline({
                inSpec: localSpec,
                inPipeline: pipeline
            });

            const tableElement = localDomCreationFuncs.versions[localDomCreationFuncs.maxVersion](resolvedSpec);

            return tableElement;
        }

        return null;
    };
};

export default createTableTask;
