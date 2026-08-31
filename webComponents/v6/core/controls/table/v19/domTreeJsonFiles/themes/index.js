import getRootTheme from "./root/index.js";
import getSearchTheme from "./search/index.js";
import getTableTheme from "./table/index.js";

export const getThemeSpecs = ({ inTheme = "light" } = {}) => {
    const localTheme = inTheme;

    return {
        root: getRootTheme({ inTheme: localTheme }),
        search: getSearchTheme({ inTheme: localTheme }),
        table: getTableTheme({ inTheme: localTheme })
    };
};

export {
    getRootTheme,
    getSearchTheme,
    getTableTheme
};

export default getThemeSpecs;
