# 📖 API Reference Manual (`API.md`)

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [Table Guide](TABLE.md) | [Form Guide](FORM.md) | [JSON-Driven Rendering](JSON_DRIVEN_RENDERING.md)

Detailed API reference manual for `ks-table-builder-from-json`.

---

## 📖 Table of Contents

- [Table Control API](#-table-control-api)
- [Form Control API](#-form-control-api)
- [Core Helpers & Spec Resolvers](#-core-helpers--spec-resolvers)
- [DOM Creation Engine](#-dom-creation-engine)
- [HTML Generation (SSR) Engine](#-html-generation-ssr-engine)
- [Custom HTML Web Components](#-custom-html-web-components)

---

## 📊 Table Control API (`webComponents/v2/core/controls/table/v1/index.js`)

### `renderTable({ inSpec, inTheme, inThemeName, inThemeSpec, inRows, inOnRowClick, inOnSearch })`

Orchestrates full 3-layer rendering for dynamic Data Tables.

- **Parameters**:
  - `inSpec` *(Object, optional)*: Overriding God Spec layout JSON template.
  - `inTheme` / `inThemeName` *(String, optional)*: Built-in theme key (`"dark"`, `"extra-dark"`, `"medium"`, `"light"`, `"extra-light"`). Default is `"light"`.
  - `inThemeSpec` *(Object, optional)*: Custom JSON theme specification object.
  - `inRows` *(Array<Object>)*: Array of row record objects.
  - `inOnRowClick` *(Function, optional)*: Callback triggered when a table row is clicked (`({ inRowElement, inEvent }) => void`).
  - `inOnSearch` *(Function, optional)*: Callback triggered on search input (`({ inQuery, inFilteredRows, inEvent }) => void`).
- **Returns**: `HTMLElement` (Table container shell).

---

### `renderSkeleton({ inSpec, inTheme, inThemeName, inThemeSpec })`

Layer 1 method: Generates table structural DOM shell (Toolbar + Header + Empty `tbody` slot container).

- **Returns**: `HTMLElement`.

---

### `bindSkeletonEvents({ inTableElement, inOnSearch, inOnRowClick })`

Layer 2 method: Binds live `input` listener to search box and `click` listener to table rows.

---

### `renderUserUI({ inSkeletonElement, inTarget, inRows })`

Layer 3 method: Passes rows through Data Mapper (`prepareTableData`), constructs `<tr>` / `<td>` DOM nodes, and mounts/refreshes them in the `tbody` slot.

---

### `prepareTableData({ inRows })`

Data Transformation Mapper: Transforms raw input objects, computes `serialNo` index (1-based), and standardizes column property accessors.

- **Returns**: `Array<Object>`.

---

### `hydrateTableData({ inSkeletonElement, inRows })`

Alias helper for hydrating rows into table body slot.

---

## 📋 Form Control API (`webComponents/v2/core/controls/form/v1/index.js`)

### `renderForm({ inSpec, inFields, inData, inOnSubmit })`

Orchestrates full 3-layer rendering for Vertical Forms.

- **Parameters**:
  - `inSpec` *(Object, optional)*: Form layout God Spec template.
  - `inFields` *(Array<Object>)*: Field definitions (`{ name, label, type, placeholder }`).
  - `inData` *(Object, optional)*: Initial form values object (`{ username: "val", ... }`).
  - `inOnSubmit` *(Function, optional)*: Callback triggered on form submit (`({ inFormData, inEvent }) => void`).
- **Returns**: `HTMLFormElement`.

---

### `renderSkeletonHtml({ inSpec })`

Layer 1 (HTML String Flavor): Generates raw HTML markup string representing the form layout skeleton shell for Server-Side Rendering (SSR).

- **Returns**: `String`.

---

### `hydrateFormData({ inFormElement, inTarget, inData })`

Layer 3 method: Populates target input elements matching `name` attributes with corresponding value properties from `inData`.

---

### `extractFormData({ inFormElement })`

Utility method: Scans form DOM element for all `<input>`, `<select>`, `<textarea>` fields and returns a key-value object.

- **Returns**: `Object`.

---

## 🛠️ Core Helpers & Spec Resolvers (`webComponents/v2/core/`)

### `resolveSpec({ inConfig, inKey, inInferredType })`

Inspects configuration objects, resolves control types (`table`, `input`, etc.), merges theme class tokens, and returns a rendered DOM element node.

---

### `pullAttributes(instance)`

Extracts inline attributes starting with `ks-` from a Web Component instance and merges them with JS `instance.config`.

- **Returns**: `Object` (Merged configuration object).

---

### `registerComponent({ inComponentClass, inTagName, inVersion, inNamespaceKey })`

Registers a Custom HTML Web Component class with `customElements.define` safely.

---

## 🧱 DOM Creation Engine (`webComponents/v2/domCreation/v2/`)

### `buildSpecElement(inSpec)`

Recursively converts a JSON specification tree into living DOM nodes (`HTMLElement`).

- **Parameters**: `inSpec` *(JsonSpecNode | Array<JsonSpecNode>)*.
- **Returns**: `HTMLElement | Array<HTMLElement> | null`.

---

## 🌐 HTML Generation (SSR) Engine (`webComponents/v2/htmlCreation/v1/`)

### `buildSpecHtml(inSpec)`

Recursively converts a JSON specification tree into a compiled HTML string markup representation with automatic HTML escaping and self-closing void element handling.

- **Parameters**: `inSpec` *(JsonSpecNode | Array<JsonSpecNode>)*.
- **Returns**: `String`.

---

## 🏷️ Custom HTML Web Components

| Custom Tag Name | Class | Namespace | Purpose |
| :--- | :--- | :--- | :--- |
| `<ks-table-base>` | `KsTableBase` | composite | Custom Web Component wrapper for Data Tables. |
| `<ks-wrapper-base>`| `KsWrapperForm` | composite | Custom Web Component wrapper for Dynamic Forms. |
| `<ks-cell-base>` | `KsTableCellContent` | classes | Custom Web Component wrapper for individual controls & cells. |

---

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [Table Guide](TABLE.md) | [Form Guide](FORM.md) | [JSON-Driven Rendering](JSON_DRIVEN_RENDERING.md)
