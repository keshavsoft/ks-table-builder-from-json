import applyTheme from "../../skeleton/applyTheme.js";

/**
 * Task Transformer: Merges theme class tokens into JSON Spec
 */
export const createApplyThemeTask = ({ inThemeSpec }) => {
    return ({ inSpec }) => {
        if (!inThemeSpec) return inSpec;
        return applyTheme({ inSpec, inThemeSpec });
    };
};

export default createApplyThemeTask;
