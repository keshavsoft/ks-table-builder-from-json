import applyTheme from "../skeleton/applyTheme.js";
import filterSections from "./filterSections.js";
import filterSerialColumn from "./filterSerialColumn.js";

/**
 * Spec Transformation Pipeline Orchestrator
 * Runs modular spec transformers sequentially: Theme -> Section Filtering -> Serial Column Filtering.
 */
export const applySpecPipeline = ({
    inSpec,
    inThemeSpec,
    inShowHeader = true,
    inShowBody = true,
    inShowFooter = true,
    inShowSerial = true
}) => {
    let spec = inSpec;

    // Step 1: Theme Spec Merger Transformer
    if (inThemeSpec) {
        spec = applyTheme({ inSpec: spec, inThemeSpec });
    }

    // Step 2: Table Sections Transformer (thead, tbody, tfoot filter)
    spec = filterSections({
        inSpec: spec,
        inShowHeader,
        inShowBody,
        inShowFooter
    });

    // Step 3: Serial Column Transformer (# column filter)
    spec = filterSerialColumn({
        inSpec: spec,
        inShowSerial
    });

    return spec;
};

export default applySpecPipeline;
