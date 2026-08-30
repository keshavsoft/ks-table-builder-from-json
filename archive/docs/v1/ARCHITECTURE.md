# 🏛️ System Architecture & Design Specification (`ARCHITECTURE.md`)

[← Back to Main README](../README.md) | [API Reference](API.md) | [Table Guide](TABLE.md) | [Form Guide](FORM.md) | [JSON-Driven Rendering](JSON_DRIVEN_RENDERING.md) | [Tailwind Classes](TAILWIND_CLASSES.md)

This document details the architectural principles, state management, separation of concerns, and component lifecycle of `ks-table-builder-from-json`.

---

## 📖 Table of Contents

- [Architectural Principles](#-architectural-principles)
- [3-Layer Orchestration Pattern](#-3-layer-orchestration-pattern)
  - [Layer 1: Skeleton Shell Creation](#layer-1-skeleton-shell-creation)
  - [Layer 2: Event Listener Hooks](#layer-2-event-listener-hooks)
  - [Layer 3: User UI & Data Hydration](#layer-3-user-ui--data-hydration)
- [Declarative JSON-Driven UI Generation](#-declarative-json-driven-ui-generation)
- [Custom HTML Web Components Layer](#-custom-html-web-components-layer)
- [Input Attribute & Parameter Naming Conventions](#-input-attribute--parameter-naming-conventions)

---

## 🌟 Architectural Principles

`ks-table-builder-from-json` is engineered around four core tenets:

1. **Zero Runtime Dependencies**: Pure Vanilla JavaScript and native Custom HTML Elements with no third-party framework overhead.
2. **Strict Separation of Concerns**: Layout Shell (Skeleton), Event Binding, and Data Hydration reside in isolated architectural layers.
3. **Dual Execution Modes**: Native support for single-call synchronous rendering and 2-phase asynchronous mounting (ideal for REST API data fetching).
4. **Tailwind CSS Token Standardization**: UI design tokens are declared as clean JSON objects, enabling effortless theme switching and zero CSS bundle bloat.

---

## 🏗️ 3-Layer Orchestration Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│               Layer 1: Skeleton Shell Creation                  │
│  (Constructs DOM Shell from God Spec JSON & Theme Tokens)       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│               Layer 2: Event Listener Hooks                     │
│  (Registers Search Toolbar & Row Click / Form Submit Hooks)     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│        Layer 3: User UI & Data Transformation                   │
│  (Maps Records -> Builds Slot Nodes -> In-Place Hydration)      │
└─────────────────────────────────────────────────────────────────┘
```

### Layer 1: Skeleton Shell Creation
- **Responsibility**: Constructs outer layout container nodes (`<div>`, `<form>`, `<table>`, `<thead>`, empty `<tbody slot="body">`).
- **Characteristics**: Does NOT render individual data rows or user controls. Accepts JSON God Spec definitions and applies theme overrides via `applyTheme`.

### Layer 2: Event Listener Hooks
- **Responsibility**: Registers event listeners on skeleton DOM nodes.
- **For Tables**: Hooks live `input` events on search inputs and `click` handlers on `<tbody> tr` rows. Performs in-place search filtering by invoking Layer 3 `renderUserUI` with filtered record sets.
- **For Forms**: Hooks `submit` events and prevents default page reloads.

### Layer 3: User UI & Data Hydration
- **Responsibility**: Data mapping (`prepareTableData`), DOM node construction for rows/controls (`buildSpecElement`), and slot mounting into target container slots (`tbody` or `form-body`).
- **Characteristics**: Operates in-place on existing skeleton DOM nodes without destroying outer layout shells.

---

## 🧱 Declarative JSON-Driven UI Generation

All UI components are generated from declarative JSON spec trees. The core pipeline includes:

- **`buildSpecElement(inSpec)`**: Converts JSON spec objects into DOM element nodes. (See [JSON-Driven Rendering Guide](JSON_DRIVEN_RENDERING.md)).
- **`buildSpecHtml(inSpec)`**: Converts JSON spec objects into HTML string markup for Server-Side Rendering (SSR). (See [HTML Generation Guide](HTML_GENERATION.md)).
- **`applyTheme({ inSpec, inThemeSpec })`**: Merges Tailwind CSS class objects into layout spec trees recursively. (See [Tailwind Classes Guide](TAILWIND_CLASSES.md)).

---

## 🏷️ Custom HTML Web Components Layer

Custom HTML Elements inherit from standard `HTMLElement`:

1. **`<ks-cell-base>` (`KsTableCellContent`)**: Individual table cell or input control renderer.
2. **`<ks-table-base>` (`KsTableBase`)**: Composite table web component wrapper.
3. **`<ks-wrapper-base>` (`KsWrapperForm`)**: Composite form wrapper web component.

### Attribute Parser (`pullAttributes`)

`pullAttributes` automatically extracts inline attributes prefixed with `ks-` and merges them with JS `config` objects to establish a single source of truth:

```javascript
// Stage 1: Pull inline attributes starting with ks-
const inlineAttrs = pullInlineAttributes({ inContext: instance });

// Stage 2: Capture JS config object
const jsConfig = captureJsConfig({ inContext: instance });

// Stage 3: Merge into Single Source of Truth
const finalConfig = { ...inlineAttrs, ...jsConfig };
```

---

## 📐 Input Attribute & Parameter Naming Conventions

All functions and methods throughout the library strictly enforce the **`in` parameter and `local` variable naming rule**:

1. **Object Destructuring for Inputs**: Functions accept a single configuration object.
2. **`in`-Prefixed Parameters**: Input keys are always prefixed with `in` followed by PascalCase (e.g., `inRows`, `inSpec`, `inOnRowClick`).
3. **`local`-Prefixed Variables**: Immediately inside the function body, `in` parameters are assigned to `local`-prefixed variables.

```javascript
export const processRecords = ({ inRows, inConfig }) => {
    // 1. Assign to local variables
    const localRows = inRows || [];
    const localConfig = inConfig || {};

    // 2. Use local variables for all execution logic
    return localRows.map(row => ({ ...row, processed: true }));
};
```

---

[← Back to Main README](../README.md) | [API Reference](API.md) | [Table Guide](TABLE.md) | [Form Guide](FORM.md) | [JSON-Driven Rendering](JSON_DRIVEN_RENDERING.md) | [Tailwind Classes](TAILWIND_CLASSES.md)
