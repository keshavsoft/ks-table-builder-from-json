# ks-table-builder-from-json

> Zero-dependency, high-performance Custom HTML Web Components and 3-Layer JavaScript architecture for dynamic Data Tables and Vertical Forms built with Tailwind CSS design tokens.

[![npm version](https://img.shields.io/npm/v/ks-table-builder-from-json.svg)](https://www.npmjs.com/package/ks-table-builder-from-json)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](https://github.com/keshavsoft/ks-table-builder-from-json)
[![Node Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](test/unit.test.js)

---

## 📖 Documentation Suite

Explore the comprehensive guides and specs for `ks-table-builder-from-json`:

| Document Guide | Description |
| :--- | :--- |
| 📊 [**Table Component Specification**](docs/TABLE.md) | Full guide to Table v11, single-call vs 2-phase async mounting, in-place search, themes, and data mapping. |
| 📋 [**Form Component Specification**](docs/FORM.md) | Guide to Form v7, 3-layer architecture, single-call, 2-phase async, SSR HTML string generation, data hydration, and extraction. |
| 🏛️ [**System Architecture & Internals**](docs/ARCHITECTURE.md) | Internal architecture, 3-Layer Orchestration Pattern, Web Components layer, and parameter naming rules. |
| 📖 [**API Reference Manual**](docs/API.md) | Full API reference for Table, Form, Core Helpers, DOM Creation Engine, HTML Generator, and Web Components. |
| 🧱 [**JSON-Driven Rendering & Specs**](docs/JSON_DRIVEN_RENDERING.md) | Breakdown of JSON spec trees, God Specs (`tableGodSpec.json`, `formGodSpec.json`), and `buildSpecElement`. |
| 🌐 [**HTML String Generation & SSR**](docs/HTML_GENERATION.md) | Details on `buildSpecHtml` for Server-Side Rendering (SSR), HTML escaping, and void elements. |
| 🎨 [**Tailwind CSS Tokens & JSON Themes**](docs/TAILWIND_CLASSES.md) | Guide to `themes.json`, `applyTheme` recursive spec merging, and class token injection. |

---

## 🌟 Key Features

- **🚀 Zero Runtime Dependencies**: Pure vanilla JavaScript & Custom HTML Web Components with zero third-party framework overhead.
- **🏗️ 3-Layer Orchestration Architecture**: Strict separation between Layout Shell (Skeleton), Event Listener Hooks, and User UI Hydration.
- **🔍 Built-in Real-Time In-Place Search**: Real-time filtering toolbar that refreshes the `tbody` slot container dynamically without re-mounting the layout shell.
- **🔢 Automated Data Mapping**: Computes serial numbers (`serialNo`), formats row values, and standardizes record schemas transparently.
- **🎨 5 Built-in Themes**: `dark`, `extra-dark`, `medium`, `light`, and `extra-light` theme spec overrides out of the box.
- **💻 Dual Execution Modes**: Support for single-call synchronous rendering or 2-phase asynchronous skeleton mounting (ideal for REST API data fetching).
- **🌐 Custom Web Components**: Custom elements (`<ks-table-base>`, `<ks-cell-base>`, `<ks-wrapper-base>`) with inline attribute parser (`ks-*`).
- **🛠️ Built-in CLI**: Scaffolding, defaults inspection, and documentation CLI helper (`npx ks-table-builder-from-json`).

---

## 🏛️ Architecture Overview

The library operates on a strict **3-Layer Architectural Pattern** designed for high throughput, predictable event handling, and clean SSR/hydration separation.

```mermaid
flowchart TD
    A[Input Data & Config] --> B[Layer 1: Skeleton Shell Creation]
    B -->|DOM Shell Node / HTML String| C[Layer 2: Event Binding Hooks]
    C -->|Hooked Search & Click/Submit| D[Layer 3: User UI & Data Hydration]
    D --> E[Rendered Table / Form DOM Element]

    subgraph Layer 1: Skeleton Shell
        B1[renderSkeleton]
        B2[renderSkeletonHtml]
        B3[applyTheme]
    end

    subgraph Layer 2: Event Hooks
        C1[bindSkeletonEvents]
        C2[handleSearch In-Place Filter]
    end

    subgraph Layer 3: User UI & Data
        D1[prepareTableData - Mapper]
        D2[renderUserUI - Slot Mounting]
        D3[hydrateFormData]
    end
```

For full details, read the [System Architecture Guide](docs/ARCHITECTURE.md).

---

## ⚡ Quickstart

### Installation

```bash
npm install ks-table-builder-from-json
```

Or initialize via CLI:

```bash
npx ks-table-builder-from-json init
```

---

## 📊 Table Controls Summary

### Single-Call Table Rendering (`renderTable`)

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
    alert(`Selected: ${itemName}`);
};

const tableElement = renderTable({
    inTheme: "dark", // "dark" | "extra-dark" | "medium" | "light" | "extra-light"
    inRows: stockRows,
    inOnRowClick: handleRowClick
});

tableContainer.appendChild(tableElement);
```

For 2-phase async mounting, filtering, and theme overrides, see the [Table Component Guide](docs/TABLE.md).

---

## 📋 Form Controls Summary

### Single-Call Form Rendering (`renderForm`)

```javascript
import { renderForm } from "ks-table-builder-from-json";

const formContainer = document.getElementById("formContainer");

const fields = [
    { name: "username", label: "Username", type: "text", placeholder: "Enter username" },
    { name: "email", label: "Email Address", type: "email", placeholder: "name@example.com" }
];

const handleSubmit = ({ inFormData, inEvent }) => {
    console.log("Form Submitted Data:", inFormData);
};

const formElement = renderForm({
    inFields: fields,
    inData: { username: "Keshav", email: "keshav@example.com" },
    inOnSubmit: handleSubmit
});

formContainer.appendChild(formElement);
```

For 2-Phase async mounting, SSR HTML string generation, data hydration, and extraction, see the [Form Component Guide](docs/FORM.md).

---

## 🏷️ Custom Web Components

Register and use custom HTML tags directly in HTML or JavaScript:

```html
<!-- Custom Table Element -->
<ks-table-base ks-theme="dark"></ks-table-base>

<!-- Custom Cell Element -->
<ks-cell-base ks-type="input" ks-placeholder="Enter item name..."></ks-cell-base>
```

---

## 📐 Parameter Naming Convention

All functions in this library follow a strict **Input Parameter & Local Variable convention**:

1. **Named Object Input**: All parameters are destructured from a single configuration object.
2. **`in`-Prefixed Parameters**: Input keys are always prefixed with `in` (e.g., `inRows`, `inSpec`, `inOnRowClick`).
3. **`local`-Prefixed Variables**: Immediately inside the function body, `in` parameters are assigned to `local`-prefixed variables.

```javascript
export const processData = ({ inRows, inConfig }) => {
    const localRows = inRows || [];
    const localConfig = inConfig || {};

    return localRows.map(row => ({ ...row, processed: true }));
};
```

---

## 🖥️ CLI Commands

```bash
# Print help menu
npx ks-table-builder-from-json --help

# Initialize sample project configuration
npx ks-table-builder-from-json init

# Display documentation overview
npx ks-table-builder-from-json docs

# View default JSON God Specs
npx ks-table-builder-from-json defaults

# View integration code snippets
npx ks-table-builder-from-json usage
```

---

## 🧪 Running Tests

Run the automated Node.js unit test suite:

```bash
npm test
```

---

## 📜 License

Distributed under the **ISC License**. Created with ❤️ by [KeshavSoft](https://github.com/keshavsoft).
