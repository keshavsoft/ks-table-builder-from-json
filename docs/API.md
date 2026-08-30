# API Reference Manual

Detailed API specification for `ks-table-builder-from-json`.

---

## 📊 Table Module API (`webComponents/v2/core/controls/table/v1/index.js`)

### `renderTable({ inSpec, inTheme, inThemeName, inThemeSpec, inRows, inOnRowClick, inOnSearch })`

Orchestrates full 3-layer rendering for Data Tables.

- **Parameters**:
  - `inSpec` *(Object, optional)*: Overriding God Spec layout JSON template.
  - `inTheme` / `inThemeName` *(String, optional)*: Theme key (`"dark"`, `"extra-dark"`, `"medium"`, `"light"`, `"extra-light"`). Default is `"light"`.
  - `inThemeSpec` *(Object, optional)*: Custom theme specification override.
  - `inRows` *(Array<Object>)*: Raw Array of row record objects.
  - `inOnRowClick` *(Function, optional)*: Callback triggered on row click (`({ inRowElement, inEvent }) => void`).
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

Layer 3 method: Passes rows through Data Mapper (`prepareTableData`), constructs `<tr>` / `<td>` DOM nodes, and mounts/refreshes them in `tbody`.

---

### `prepareTableData({ inRows })`

Data Transformation Mapper: Transforms raw input objects, computes `serialNo` index (1-based), and standardizes column property accessors.

---

## 📋 Form Module API (`webComponents/v2/core/controls/form/v1/index.js`)

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

Layer 1 (HTML Flavor): Generates raw HTML markup string representing the form layout skeleton shell.

- **Returns**: `String`.

---

### `hydrateFormData({ inFormElement, inTarget, inData })`

Layer 3 method: Populates target input elements matching `name` attributes with corresponding value properties from `inData`.

---

### `extractFormData({ inFormElement })`

Utility method: Scans form DOM element for all `<input>`, `<select>`, `<textarea>` fields and returns a key-value key map object.
