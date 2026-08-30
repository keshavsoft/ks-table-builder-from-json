import buildSpecElement from "../../../../../domCreation/v2/buildSpecElement.js";
import defaultGodSpec from "../tableGodSpec.json" with { type: "json" };
import resolveThemeSpec from "../themes/index.js";
import applyTheme from "./applyTheme.js";

/**
 * Filter out table section nodes (thead, tbody, tfoot) based on visibility flags
 */
const filterTableSections = ({ inSpec, inShowHeader, inShowBody, inShowFooter }) => {
    if (!inSpec || typeof inSpec !== "object") return inSpec;

    if (Array.isArray(inSpec)) {
        return inSpec
            .map(item => filterTableSections({ inSpec: item, inShowHeader, inShowBody, inShowFooter }))
            .filter(Boolean);
    }

    const tagName = inSpec.tagName?.toLowerCase();

    if (tagName === "thead" && !inShowHeader) return null;
    if (tagName === "tbody" && !inShowBody) return null;
    if (tagName === "tfoot" && !inShowFooter) return null;

    if (Array.isArray(inSpec.children)) {
        const filteredChildren = inSpec.children
            .map(child => filterTableSections({ inSpec: child, inShowHeader, inShowBody, inShowFooter }))
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
 * Supports inShowHeader, inShowBody, inShowFooter toggles.
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

    // Filter thead, tbody, tfoot nodes dynamically according to visibility options
    resolvedSpec = filterTableSections({
        inSpec: resolvedSpec,
        inShowHeader: localShowHeader,
        inShowBody: localShowBody,
        inShowFooter: localShowFooter
    });

    // Build DOM tree skeleton for table & toolbar
    const skeletonElement = buildSpecElement(resolvedSpec);

    if (skeletonElement) {
        const serialTh = skeletonElement.querySelector('thead th:first-child');
        if (serialTh) {
            if (serialTh.textContent.trim() === '#' || serialTh.getAttribute('data-serial-th') === 'true') {
                serialTh.setAttribute('data-serial-th', 'true');
                serialTh.style.display = localShowSerial ? '' : 'none';
            }
        }
    }

    return skeletonElement;
};

export default renderSkeleton;
