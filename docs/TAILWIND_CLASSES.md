# 🎨 Tailwind CSS Tokens & JSON Themes (`TAILWIND_CLASSES.md`)

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [API Reference](API.md) | [Table Guide](TABLE.md) | [JSON-Driven Rendering](JSON_DRIVEN_RENDERING.md)

This document explains how Tailwind CSS design tokens and class definitions are structured in JSON objects within `ks-table-builder-from-json`, and how they are merged dynamically into rendered DOM elements.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Themes JSON Structure (`themes.json`)](#-themes-json-structure-themesjson)
- [Recursive Theme Merging (`applyTheme`)](#-recursive-theme-merging-applytheme)
- [Dynamic Class Injection (`inClassList`)](#-dynamic-class-injection-inclasslist)
- [Custom Theme Spec Overrides](#-custom-theme-spec-overrides)

---

## 🌟 Overview

`ks-table-builder-from-json` does not embed CSS stylesheet files or inline style attributes. Instead, component themes are defined as **Tailwind CSS design token strings** inside JSON files.

Benefits:
- **Utility-First Flexibility**: Fully compatible with any Tailwind CSS pipeline (CDN, Vite, Next.js, PostCSS).
- **Theme Swapping**: Switch dark/light themes instantly by passing a theme key or theme JSON object.
- **Zero CSS Overhead**: No heavy global CSS bundles loaded into the browser.

---

## 🎨 Themes JSON Structure (`themes.json`)

Located at `webComponents/v2/core/themes.json`:

```json
{
  "default": {
    "button": "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    "input": "border border-gray-300 rounded px-3 py-2",
    "checkbox": "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded",
    "label": "block text-sm font-medium text-gray-700",
    "table": {
      "table": "w-full border-collapse border border-gray-300 my-4",
      "thead": "",
      "th": "border border-gray-300 px-4 py-2 bg-gray-100 text-left text-sm font-semibold text-gray-700",
      "tbody": "",
      "td": "border border-gray-300 px-4 py-2 text-sm text-gray-800"
    }
  },
  "light": {
    "button": "bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded border border-gray-300",
    "input": "border border-gray-300 bg-white rounded px-3 py-2 text-gray-800",
    "checkbox": "w-4 h-4 text-blue-600 bg-white border-gray-300 rounded",
    "label": "block text-sm font-medium text-gray-800",
    "table": {
      "table": "w-full border-collapse border border-gray-200 my-4",
      "thead": "",
      "th": "border border-gray-200 px-4 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-600",
      "tbody": "",
      "td": "border border-gray-200 px-4 py-2 text-sm text-gray-700"
    }
  },
  "dark": {
    "button": "bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded",
    "input": "border border-gray-600 bg-gray-800 text-white rounded px-3 py-2",
    "checkbox": "w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded",
    "label": "block text-sm font-medium text-gray-300",
    "table": {
      "table": "w-full border-collapse border border-gray-700 my-4 bg-gray-900 text-white",
      "thead": "",
      "th": "border border-gray-700 px-4 py-2 bg-gray-800 text-left text-sm font-semibold text-gray-200",
      "tbody": "",
      "td": "border border-gray-700 px-4 py-2 text-sm text-gray-300"
    }
  }
}
```

---

## 🔄 Recursive Theme Merging (`applyTheme`)

Located at `webComponents/v2/core/controls/table/v1/skeleton/applyTheme.js`.

When a theme specification (`inThemeSpec`) is provided, `applyTheme` recursively maps class attributes from the theme spec tree into matching node positions in the layout JSON spec tree:

```javascript
import applyTheme from "./webComponents/v2/core/controls/table/v1/skeleton/applyTheme.js";

const layoutSpec = {
    tagName: "div",
    attributes: { class: "table-wrapper space-y-3" },
    children: [
        { tagName: "table", attributes: { class: "w-full" } }
    ]
};

const darkThemeSpec = {
    attributes: { class: "table-wrapper space-y-3 bg-slate-950 p-4 rounded-xl" },
    children: [
        { tagName: "table", attributes: { class: "w-full bg-slate-900 text-slate-100" } }
    ]
};

const themedSpec = applyTheme({
    inSpec: layoutSpec,
    inThemeSpec: darkThemeSpec
});

console.log(themedSpec);
```

---

## ⚡ Dynamic Class Injection (`inClassList`)

During DOM node creation in `domElementBuilder({ inSpec, inClassList })`:
1. `attributes.class` from the JSON spec is applied to `element.className`.
2. Any additional space-separated Tailwind classes provided in `inClassList` are tokenized and appended via `element.classList.add(...)`.

```javascript
// Step 4 in domCreation/v2/index.js
if (inClassList) {
    element.classList.add(...inClassList.split(/\s+/).filter(Boolean));
}
```

---

## 🛠️ Custom Theme Spec Overrides

You can pass a custom theme JSON object directly when invoking controls:

```javascript
import { renderTable } from "ks-table-builder-from-json";

const customTheme = {
    attributes: {
        class: "table-wrapper space-y-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl"
    },
    children: [
        {
            attributes: { class: "table-toolbar bg-slate-800/80 p-4 rounded-xl border border-slate-700" }
        }
    ]
};

const tableElement = renderTable({
    inThemeSpec: customTheme,
    inRows: myRows
});
```

---

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [API Reference](API.md) | [Table Guide](TABLE.md) | [JSON-Driven Rendering](JSON_DRIVEN_RENDERING.md)
