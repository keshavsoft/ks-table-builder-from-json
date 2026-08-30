# 📊 Data Table Component Specification (`TABLE.md`)

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [API Reference](API.md) | [Form Guide](FORM.md)

`ks-table-builder-from-json` provides high-performance, zero-dependency Data Table controls built on a **3-Layer Architectural Pattern** with native Tailwind CSS styling tokens.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [3-Layer Architecture Breakdown](#-3-layer-architecture-breakdown)
- [Execution Patterns](#-execution-patterns)
  - [1. Single-Call Orchestration (`renderTable`)](#1-single-call-orchestration-rendertable)
  - [2. 2-Phase Asynchronous Mount Pattern](#2-2-phase-asynchronous-mount-pattern)
- [Real-Time In-Place Search Toolbar](#-real-time-in-place-search-toolbar)
- [Automated Data Mapping (`prepareTableData`)](#-automated-data-mapping-preparetabledata)
- [Themes & Tailwind CSS Tokens](#-themes--tailwind-css-tokens)
- [Event Callbacks & Hooks](#-event-callbacks--hooks)
- [Custom HTML Web Component (`<ks-table-base>`)](#-custom-html-web-component-ks-table-base)

---

## 🌟 Overview

The Table Control module (`webComponents/v2/core/controls/table/v1/index.js`) processes raw JSON array records and converts them into reactive HTML tables with zero third-party dependencies.

Key Capabilities:
- **Automatic Serial Number (`serialNo`)**: Auto-indexed row numbers.
- **In-Place Search Toolbar**: Filtering occurs directly inside the `<tbody slot="body">` container without re-rendering the layout skeleton.
- **Theme Overrides**: Built-in visual themes (`dark`, `extra-dark`, `medium`, `light`, `extra-light`).
- **2-Phase Async Support**: Mount an immediate DOM shell for zero layout shift, then hydrate data when REST API requests complete.

---

## 🏛️ 3-Layer Architecture Breakdown

```
┌───────────────────────────────────────────────────────────────┐
│               Layer 1: Skeleton Creation                      │
│   (renderSkeleton - Builds Toolbar, <thead>, and empty tbody) │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│               Layer 2: Event Listener Hooks                   │
│   (bindSkeletonEvents - Attaches Search & Row Click Listeners)│
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│          Layer 3: User UI & Data Transformation               │
│ (prepareTableData -> renderUserUI - Hydrates <tr> rows in-place)│
└───────────────────────────────────────────────────────────────┘
```

1. **Layer 1 (Skeleton Shell)**: `renderSkeleton({ inSpec, inTheme })` creates the layout wrapper, toolbar search input, table header (`<thead>`), and an empty body slot (`<tbody slot="body">`).
2. **Layer 2 (Event Hooks)**: `bindSkeletonEvents({ inTableElement, inOnSearch, inOnRowClick })` registers event handlers on the skeleton DOM nodes.
3. **Layer 3 (User UI & Data)**: `renderUserUI({ inSkeletonElement, inRows })` transforms data rows using `prepareTableData` and populates the `<tbody>` slot.

---

## ⚡ Execution Patterns

### 1. Single-Call Orchestration (`renderTable`)

Use `renderTable` when data is already available synchronously in memory.

```javascript
import { renderTable } from "ks-table-builder-from-json";

const tableContainer = document.getElementById("tableContainer");

const stockRows = [
    { StockItemName: "0.09/30mm", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
    { StockItemName: "0.11-25", StockParentName: "FISH KNITTED FABRIC", Uom: "kgs" },
    { StockItemName: "0.14/30mm", StockParentName: "COTTON FABRIC", Uom: "meters" }
];

const handleRowClick = ({ inRowElement, inEvent }) => {
    const itemName = inRowElement.children[1]?.textContent;
    console.log("Selected Row Item:", itemName);
};

const tableElement = renderTable({
    inTheme: "dark", // "dark" | "extra-dark" | "medium" | "light" | "extra-light"
    inRows: stockRows,
    inOnRowClick: handleRowClick
});

tableContainer.appendChild(tableElement);
```

---

### 2. 2-Phase Asynchronous Mount Pattern

Use this pattern when fetching table data over an HTTP API / REST call to prevent visual layout shifts.

```javascript
import { renderSkeleton, bindSkeletonEvents, renderUserUI } from "ks-table-builder-from-json";

const container = document.getElementById("tableContainer");

// Phase 1: Render layout skeleton shell immediately
const skeletonElement = renderSkeleton({ inTheme: "medium" });

bindSkeletonEvents({
    inTableElement: skeletonElement,
    inOnRowClick: ({ inRowElement }) => {
        console.log("Row clicked:", inRowElement);
    }
});

container.appendChild(skeletonElement);

// Phase 2: Fetch data asynchronously & hydrate the tbody slot
fetch("/api/v1/stock-items")
    .then(res => res.json())
    .then(data => {
        renderUserUI({
            inSkeletonElement: skeletonElement,
            inRows: data
        });
    });
```

---

## 🔍 Real-Time In-Place Search Toolbar

The table skeleton includes a real-time search `<input>`. When the user types into the search box:
1. `handleSearch` is triggered automatically by Layer 2 event hooks.
2. The search query filters rows against `StockItemName`, `StockParentName`, and `Uom`.
3. `renderUserUI` clears and re-populates the existing `<tbody slot="body">` DOM node without destroying or re-mounting the outer table shell.

To supply a custom search listener:

```javascript
renderTable({
    inRows: stockRows,
    inOnSearch: ({ inQuery, inFilteredRows, inEvent }) => {
        console.log(`Search Query: "${inQuery}", Matching Records: ${inFilteredRows.length}`);
    }
});
```

---

## 🔢 Automated Data Mapping (`prepareTableData`)

Before rendering, `prepareTableData` standardizes raw record objects:
- Automatically injects `serialNo` (1-based index: 1, 2, 3...).
- Maps property keys (`StockItemName`, `StockParentName`, `Uom`).
- Formats empty or null values gracefully.

```javascript
import { prepareTableData } from "ks-table-builder-from-json";

const rawRows = [{ StockItemName: "Item A" }, { StockItemName: "Item B" }];
const prepared = prepareTableData({ inRows: rawRows });

console.log(prepared);
// Output:
// [
//   { serialNo: 1, StockItemName: "Item A", StockParentName: "-", Uom: "-" },
//   { serialNo: 2, StockItemName: "Item B", StockParentName: "-", Uom: "-" }
// ]
```

---

## 🎨 Themes & Tailwind CSS Tokens

Five pre-configured themes are built into the table control spec (`webComponents/v2/core/controls/table/v1/themes/`):

| Theme Key | Background | Header | Text Color | Border Color |
| :--- | :--- | :--- | :--- | :--- |
| `light` | White (`bg-white`) | Soft Gray (`bg-gray-50`) | Gray 800 | Gray 200 |
| `medium` | Slate 900 (`bg-slate-900`) | Slate 800 (`bg-slate-800`) | Slate 100 | Slate 700 |
| `dark` | Gray 900 (`bg-gray-900`) | Gray 800 (`bg-gray-800`) | Gray 200 | Gray 700 |
| `extra-dark` | Black (`bg-black`) | Neutral 900 (`bg-neutral-900`)| White | Neutral 800 |
| `extra-light` | Pure White (`bg-white`) | Indigo 50 (`bg-indigo-50`) | Slate 900 | Indigo 100 |

To apply a custom theme spec programmatically:

```javascript
renderTable({
    inThemeSpec: myCustomThemeJson,
    inRows: rows
});
```

---

## ⚡ Event Callbacks & Hooks

| Event Callback Key | Triggered When | Arguments Passed |
| :--- | :--- | :--- |
| `inOnRowClick` | User clicks any `<tr>` row inside table body. | `({ inRowElement, inEvent })` |
| `inOnSearch` | User types into the search input box. | `({ inQuery, inFilteredRows, inEvent })` |

---

## 🏷️ Custom HTML Web Component (`<ks-table-base>`)

You can instantiate table controls directly in declarative HTML using Web Components:

```html
<ks-table-base ks-theme="dark"></ks-table-base>

<script type="module">
    import "ks-table-builder-from-json";
    
    const tableComponent = document.querySelector("ks-table-base");
    tableComponent.config = {
        inRows: [
            { StockItemName: "Item 1", StockParentName: "Category A", Uom: "pcs" }
        ]
    };
</script>
```

---

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [API Reference](API.md) | [Form Guide](FORM.md)
