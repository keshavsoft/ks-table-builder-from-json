import buildSpecElement from "../../../../../domCreation/v2/buildSpecElement.js";
import defaultGodSpec from "../tableGodSpec.json" with { type: "json" };
import resolveThemeSpec from "../themes/index.js";
import applyTheme from "./applyTheme.js";

/**
 * Filter out table section nodes (thead, tbody, tfoot) based on visibility flags,
 * and handle inShowSerial at the JSON spec level by toggling the # serial column spec element.
 */
const filterTableSections = ({ inSpec, inShowHeader, inShowBody, inShowFooter, inShowSerial }) => {
    if (!inSpec || typeof inSpec !== "object") return inSpec;

    if (Array.isArray(inSpec)) {
        return inSpec
            .map(item => filterTableSections({ inSpec: item, inShowHeader, inShowBody, inShowFooter, inShowSerial }))
            .filter(Boolean);
    }

    const tagName = inSpec.tagName?.toLowerCase();

    if (tagName === "thead" && !inShowHeader) return null;
    if (tagName === "tbody" && !inShowBody) return null;
    if (tagName === "tfoot" && !inShowFooter) return null;

    // Spec-level inShowSerial logic: if inside a tr, check if the first th/td is a serial column (#)
    if (tagName === "tr" && Array.isArray(inSpec.children)) {
        let children = inSpec.children;
        if (!inShowSerial) {
            // Omit first th/td element if it's the serial column (#)
            children = children.filter((child, index) => {
                if (index === 0 && (child.textContent === "#" || child.attributes?.["data-serial"] === "true")) {
                    return false;
                }
                return true;
            });
        }
        return {
            ...inSpec,
            children: children.map(child => filterTableSections({ inSpec: child, inShowHeader, inShowBody, inShowFooter, inShowSerial })).filter(Boolean)
        };
    }

    if (Array.isArray(inSpec.children)) {
        const filteredChildren = inSpec.children
            .map(child => filterTableSections({ inSpec: child, inShowHeader, inShowBody, inShowFooter, inShowSerial }))
            .filter(Boolean);

        return {
            ...inSpec,
            children: filteredChildren
        };
    }

    return inSpec;
};

/**
 * Layer 1: Table Skeleton Render
 * Builds structural DOM Toolbar + <table> shell from tableGodSpec.json template.
 * Handles inShowHeader, inShowBody, inShowFooter, and inShowSerial directly at the JSON spec array level.
 */
export const renderSkeleton = ({
    inSpec,
    inTheme,
    inThemeName,
    inThemeSpec,
    inShowSerial = true,
    inShowHeader = true,
    inShowBody = true,
    inShowFooter = true
}) => {
    const localSpec = inSpec || defaultGodSpec;
    const localShowSerial = inShowSerial !== false;
    const localShowHeader = inShowHeader !== false;
    const localShowBody = inShowBody !== false;
    const localShowFooter = inShowFooter !== false;

    const resolvedThemeSpec = resolveThemeSpec({ inTheme, inThemeName, inThemeSpec });

    let resolvedSpec = resolvedThemeSpec
        ? applyTheme({ inSpec: localSpec, inThemeSpec: resolvedThemeSpec })
        : localSpec;

    // Filter thead, tbody, tfoot & serial column elements directly in the JSON Spec before DOM creation
    resolvedSpec = filterTableSections({
        inSpec: resolvedSpec,
        inShowHeader: localShowHeader,
        inShowBody: localShowBody,
        inShowFooter: localShowFooter,
        inShowSerial: localShowSerial
    });

    // Build DOM tree skeleton for table & toolbar from transformed Spec
    const skeletonElement = buildSpecElement(resolvedSpec);
    return skeletonElement;
};

export default renderSkeleton;
