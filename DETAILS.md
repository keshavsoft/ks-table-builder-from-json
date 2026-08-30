# Detailed Technical Manual (`DETAILS.md`)

Comprehensive technical architecture, design patterns, and module structure of `ks-table-builder-from-json`.

---

## 🏛️ Architecture Overview

`ks-table-builder-from-json` is built on a **3-Layer Component Control Architecture** designed to achieve zero runtime overhead, high DOM rendering throughput, and complete separation between layout skeleton shells, event binding hooks, and user UI data hydration.

```
┌────────────────────────────────────────────────────────┐
│               Layer 1: Skeleton Creation               │
│   (Builds DOM Shell from God Spec JSON & Theme Token)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               Layer 2: Event Binding Hooks             │
│    (Attaches Search & Row Click / Form Submit Hooks)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│        Layer 3: User UI & Data Transformation          │
│   (Maps Data Records -> Builds Slot Nodes -> Hydrates) │
└───────────────────────────┴────────────────────────────┘
```

---

## 📂 Key Modules & Project Structure

- **`index.js`**: Main library entry point. Re-exports Table Controls, Form Controls, Spec Resolvers, Attribute Pullers, and Web Component Registers.
- **`webComponents/v2/core/`**:
  - `controls/table/v1/`: Table v11 orchestrator, skeleton renderer, search toolbar binder, and data mapper (`prepareTableData`).
  - `controls/form/v1/`: Form v7 orchestrator, skeleton renderer, SSR HTML string generator (`renderSkeletonHtml`), and data hydration (`hydrateFormData`).
  - `specResolver.js`: Central control type resolver and theme token mapper.
  - `pullAttributes.js`: Inline `ks-` attribute parser and configuration object merger.
  - `componentRegister.js`: Safe Custom HTML Web Component registration helper.
  - `themes.json`: Tailwind CSS design token specifications for `default`, `light`, and `dark` themes.
- **`webComponents/v2/domCreation/v2/`**:
  - `index.js`: Low-level DOM element builder (`domElementBuilder`).
  - `buildSpecElement.js`: Recursive JSON spec tree to `HTMLElement` converter.
- **`webComponents/v2/htmlCreation/v1/`**:
  - `buildSpecHtml.js`: Recursive JSON spec tree to HTML string markup compiler for Server-Side Rendering (SSR).
- **`docs/`**:
  - `index.html`: Interactive GitHub Pages documentation portal & live component playground.
  - `TABLE.md`: Table component specification manual.
  - `FORM.md`: Form component specification manual.
  - `ARCHITECTURE.md`: Detailed architecture specification.
  - `API.md`: API reference manual.
  - `JSON_DRIVEN_RENDERING.md`: JSON spec tree rendering engine documentation.
  - `HTML_GENERATION.md`: Server-Side Rendering (SSR) compiler documentation.
  - `TAILWIND_CLASSES.md`: Tailwind CSS JSON token documentation.
- **`test/`**:
  - `unit.test.js`: Automated unit test suite using Node's native `node:test` runner.
  - `index.html`: Test suite hub dashboard UI.
  - `table/`: Browser integration tests for Table controls.
  - `form/`: Browser integration tests for Form controls.

---

## 📐 Input Attribute & Parameter Naming Conventions

All functions and constructors in this library follow strict destructuring and variable naming rules:

1. **Named Object Destructuring**: All inputs are passed inside a single config object.
2. **`in`-Prefixed Parameters**: Input keys inside the configuration object are prefixed with `in` (e.g. `inRows`, `inSpec`, `inOnRowClick`).
3. **`local`-Prefixed Variables**: Immediately inside the function body, `in` parameters are assigned to `local`-prefixed variables.

```javascript
export const prepareTableData = ({ inRows }) => {
    const localRows = inRows || [];

    return localRows.map((row, index) => ({
        ...row,
        serialNo: index + 1,
        StockItemName: row.StockItemName || "",
        StockParentName: row.StockParentName || "",
        Uom: row.Uom || row.StockBaseUnits || ""
    }));
};
```

---

## 🌐 Custom Web Components

The library defines three Custom HTML Web Components:

- **`<ks-table-base>`** (`KsTableBase`): Composite Web Component wrapper for Data Tables.
- **`<ks-wrapper-base>`** (`KsWrapperForm`): Composite Web Component wrapper for Dynamic Forms.
- **`<ks-cell-base>`** (`KsTableCellContent`): Cell and input control Web Component wrapper.

---

## 📜 License

ISC License. Created with ❤️ by KeshavSoft.
