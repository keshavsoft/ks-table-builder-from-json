# System Architecture & Design Specification

Overview of the design principles, state management, and separation of concerns in `ks-table-builder-from-json`.

---

## 🏗️ 3-Layer Component Control Pattern

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
└────────────────────────────────────────────────────────┘
```

### Layer 1: Skeleton Shell Generation
- Responsibility: Constructs the layout container nodes (`<div>`, `<form>`, `<table>`, `<thead>`, `<tbody>` slot).
- Does NOT construct user controls or data rows.
- Accepts JSON God Spec definitions and applies theme overrides via `applyTheme`.

### Layer 2: Event Listener Hooks
- Responsibility: Registers event listeners on skeleton DOM nodes.
- For Tables: Hooks `input` events on `#tableSearchInput` and `click` events on `<tbody> tr`.
- Handles in-place search filtering by calling Layer 3 `renderUserUI` with filtered rows.

### Layer 3: User UI & Data Hydration
- Responsibility: Data mapping (`prepareTableData`), DOM node construction for rows/controls (`buildSpecElement`), and slot mounting into the target `tbody` / `form-body`.
- Supports both in-memory DOM Node references and CSS selector string targets.

---

## 🏷️ Custom Web Components Layer

Custom HTML Elements inherit from standard `HTMLElement`:

1. `<ks-cell-base>` (`KsTableCellContent`): Individual table cell or input control renderer.
2. `<ks-table-base>` (`KsTableBase`): Composite table web component wrapper.
3. `<ks-wrapper-base>` (`KsWrapperForm`): Composite form wrapper web component.

Attribute parser `pullAttributes` extracts inline attributes prefixed with `ks-` and merges them with JS `config` objects to maintain a single source of truth.
