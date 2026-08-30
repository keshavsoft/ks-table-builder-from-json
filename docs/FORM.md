# 📋 Vertical Form Component Specification (`FORM.md`)

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [API Reference](API.md) | [Table Guide](TABLE.md)

`ks-table-builder-from-json` includes high-performance Form Controls built on a **3-Layer Architectural Pattern** for single-call rendering, asynchronous skeleton mounting, and Server-Side Rendering (SSR) HTML string generation.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [3-Layer Form Architecture](#-3-layer-form-architecture)
- [Execution Patterns](#-execution-patterns)
  - [1. Single-Call Form Creation (`renderForm`)](#1-single-call-form-creation-renderform)
  - [2. 2-Phase Asynchronous Mount Pattern](#2-2-phase-asynchronous-mount-pattern)
  - [3. SSR HTML String Generation (`renderSkeletonHtml`)](#3-ssr-html-string-generation-renderskeletonhtml)
- [Data Hydration (`hydrateFormData`)](#-data-hydration-hydrateformdata)
- [Data Extraction (`extractFormData`)](#-data-extraction-extractformdata)
- [Form Field Specification Schema](#-form-field-specification-schema)
- [Custom HTML Web Component (`<ks-wrapper-base>`)](#-custom-html-web-component-ks-wrapper-base)

---

## 🌟 Overview

The Form Control module (`webComponents/v2/core/controls/form/v1/index.js`) processes JSON field definitions and data payloads to construct styled dynamic forms.

Key Capabilities:
- **Zero Dependencies**: Pure vanilla DOM generation with zero external library overhead.
- **SSR Ready**: Generate static HTML markup strings via `renderSkeletonHtml` for backend template rendering.
- **Data Hydration**: Populate existing forms programmatically using `hydrateFormData`.
- **Form Data Extraction**: Extract user inputs into a key-value JSON object with `extractFormData`.

---

## 🏛️ 3-Layer Form Architecture

```
┌───────────────────────────────────────────────────────────────┐
│               Layer 1: Skeleton Creation                      │
│   (renderSkeleton / renderSkeletonHtml - Form Container)     │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│               Layer 2: Event Listener Hooks                   │
│   (bindSkeletonEvents - Attaches Submit Listener)             │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│          Layer 3: User UI & Data Hydration                    │
│   (renderUserUI -> hydrateFormData - Mounts inputs & values)  │
└───────────────────────────────┴───────────────────────────────┘
```

1. **Layer 1 (Skeleton Shell)**: `renderSkeleton` (DOM Node) or `renderSkeletonHtml` (HTML String) constructs the outer `<form>` layout shell.
2. **Layer 2 (Event Hooks)**: `bindSkeletonEvents({ inFormElement, inOnSubmit })` hooks submission events and prevents default page reloads.
3. **Layer 3 (User UI & Data)**: `renderUserUI` mounts form field controls, and `hydrateFormData` fills form controls with initial key-value data.

---

## ⚡ Execution Patterns

### 1. Single-Call Form Creation (`renderForm`)

Construct a complete dynamic form in a single function call:

```javascript
import { renderForm } from "ks-table-builder-from-json";

const formContainer = document.getElementById("formContainer");

const fields = [
    { name: "username", label: "Username", type: "text", placeholder: "Enter username" },
    { name: "email", label: "Email Address", type: "email", placeholder: "name@example.com" },
    { name: "role", label: "Account Role", type: "text", placeholder: "Admin / Editor" }
];

const initialData = {
    username: "Keshav",
    email: "keshav@example.com",
    role: "Admin"
};

const handleSubmit = ({ inFormData, inEvent }) => {
    inEvent.preventDefault();
    console.log("Form Data Submitted:", inFormData);
};

const formElement = renderForm({
    inFields: fields,
    inData: initialData,
    inOnSubmit: handleSubmit
});

formContainer.appendChild(formElement);
```

---

### 2. 2-Phase Asynchronous Mount Pattern

Mount the form shell immediately while loading schema or initial values asynchronously:

```javascript
import { renderSkeleton, bindSkeletonEvents, renderUserUI, hydrateFormData } from "ks-table-builder-from-json";

const formContainer = document.getElementById("formContainer");

// Phase 1: Mount skeleton DOM immediately
const skeletonElement = renderSkeleton({});

bindSkeletonEvents({
    inFormElement: skeletonElement,
    inOnSubmit: ({ inFormData, inEvent }) => {
        inEvent.preventDefault();
        console.log("Form Payload:", inFormData);
    }
});

formContainer.appendChild(skeletonElement);

// Phase 2: Fetch field specs & initial data from REST API
Promise.all([
    fetch("/api/form-spec").then(res => res.json()),
    fetch("/api/user-profile").then(res => res.json())
]).then(([fieldsSpec, userProfile]) => {
    // Mount fields into form body slot
    renderUserUI({
        inSkeletonElement: skeletonElement,
        inFields: fieldsSpec
    });

    // Populate field values
    hydrateFormData({
        inFormElement: skeletonElement,
        inData: userProfile
    });
});
```

---

### 3. SSR HTML String Generation (`renderSkeletonHtml`)

For Node.js / Server-Side Rendering environments:

```javascript
import { renderSkeletonHtml } from "ks-table-builder-from-json";

const formMarkup = renderSkeletonHtml({
    inSpec: {
        tagName: "form",
        attributes: { class: "p-6 bg-slate-900 rounded-xl space-y-4" }
    }
});

console.log(formMarkup);
// Output: <form class="p-6 bg-slate-900 rounded-xl space-y-4"></form>
```

---

## 💧 Data Hydration (`hydrateFormData`)

`hydrateFormData` matches property keys from `inData` against element `name` attributes:

```javascript
import { hydrateFormData } from "ks-table-builder-from-json";

hydrateFormData({
    inFormElement: myFormNode,
    inData: {
        username: "Keshav",
        email: "support@keshavsoft.com"
    }
});
```

---

## 📤 Data Extraction (`extractFormData`)

`extractFormData` scans form controls (`<input>`, `<select>`, `<textarea>`) and constructs a key-value object:

```javascript
import { extractFormData } from "ks-table-builder-from-json";

const formDataObject = extractFormData({ inFormElement: myFormNode });
console.log(formDataObject);
// Output: { username: "Keshav", email: "support@keshavsoft.com" }
```

---

## 📋 Form Field Specification Schema

Each field object in `inFields` array accepts:

| Key | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Field control identifier matching JSON key. |
| `label` | String | User-facing field label text. |
| `type` | String | Input type (`"text"`, `"email"`, `"password"`, `"number"`, `"checkbox"`). |
| `placeholder` | String | Optional input placeholder text. |
| `value` | String / Any | Optional initial value. |

---

## 🏷️ Custom HTML Web Component (`<ks-wrapper-base>`)

Declarative HTML usage for custom forms:

```html
<ks-wrapper-base ks-type="form"></ks-wrapper-base>

<script type="module">
    import "ks-table-builder-from-json";
    
    const wrapper = document.querySelector("ks-wrapper-base");
    wrapper.config = {
        inFields: [
            { name: "itemName", label: "Item Name", type: "text" },
            { name: "quantity", label: "Quantity", type: "number" }
        ],
        inOnSubmit: ({ inFormData }) => console.log(inFormData)
    };
</script>
```

---

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [API Reference](API.md) | [Table Guide](TABLE.md)
