import darkSpec from "./dark.json" with { type: "json" };
import extraDarkSpec from "./extra-dark.json" with { type: "json" };
import extraLightSpec from "./extra-light.json" with { type: "json" };
import lightSpec from "./light.json" with { type: "json" };
import mediumSpec from "./medium.json" with { type: "json" };

export const themes = {
    "extra-dark": extraDarkSpec,
    "dark": darkSpec,
    "medium": mediumSpec,
    "light": lightSpec,
    "extra-light": extraLightSpec,
    "default": lightSpec
};

export const resolveThemeSpec = ({ inTheme, inThemeName, inThemeSpec }) => {
    const localThemeSpec = inThemeSpec;
    const themeName = (typeof inTheme === "string" ? inTheme : inThemeName);

    if (localThemeSpec && typeof localThemeSpec === "object") {
        return localThemeSpec;
    }

    if (typeof inTheme === "object" && inTheme !== null) {
        return inTheme;
    }

    if (themeName && themes[themeName]) {
        return themes[themeName];
    }

    return themes["default"];
};

export default resolveThemeSpec;
