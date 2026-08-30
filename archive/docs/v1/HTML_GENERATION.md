# 🌐 HTML String Generation & SSR (`HTML_GENERATION.md`)

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [API Reference](API.md) | [JSON-Driven Rendering](JSON_DRIVEN_RENDERING.md) | [Form Guide](FORM.md)

This guide documents the HTML compilation engine (`webComponents/v2/htmlCreation/v1/buildSpecHtml.js`) used for Server-Side Rendering (SSR) and static HTML markup generation from JSON spec trees.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Function Signature & Usage](#-function-signature--usage)
- [HTML Escaping & Security](#-html-escaping--security)
- [Void / Self-Closing Element Handling](#-void--self-closing-element-handling)
- [Code Examples](#-code-examples)

---

## 🌟 Overview

While `buildSpecElement` creates live browser DOM element nodes (`HTMLElement`), `buildSpecHtml` converts the exact same JSON spec tree into a compiled HTML string markup representation.

This dual-flavor design enables:
- **Server-Side Rendering (SSR)** in Node.js, Express, or Edge runtimes.
- **Static Template Pre-Rendering**.
- **String-based HTML exports**.

---

## 🛠️ Function Signature & Usage

```javascript
import buildSpecHtml from "ks-table-builder-from-json/webComponents/v2/htmlCreation/v1/buildSpecHtml.js";
```

### Signature:
```typescript
function buildSpecHtml(inSpec: JsonSpecNode | JsonSpecNode[]): string
```

### Example:

```javascript
const formSpec = {
    tagName: "form",
    attributes: { action: "/submit", method: "POST", class: "p-4 bg-slate-900" },
    children: [
        {
            tagName: "label",
            attributes: { class: "block text-sm text-slate-300" },
            textContent: "User Email"
        },
        {
            tagName: "input",
            attributes: { type: "email", name: "email", placeholder: "user@example.com", class: "border rounded p-2" }
        }
    ]
};

const htmlString = buildSpecHtml(formSpec);
console.log(htmlString);
```

### Output:

```html
<form action="/submit" method="POST" class="p-4 bg-slate-900">
<label class="block text-sm text-slate-300">User Email</label>
<input type="email" name="email" placeholder="user@example.com" class="border rounded p-2" />
</form>
```

---

## 🔒 HTML Escaping & Security

To prevent XSS (Cross-Site Scripting) vulnerabilities during HTML string compilation, text content and attribute values are automatically sanitized using HTML character escaping:

| Character | Escaped Output |
| :--- | :--- |
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `'` | `&#039;` |

```javascript
const maliciousSpec = {
    tagName: "span",
    attributes: { title: 'User "Name" & Info' },
    textContent: "<script>alert('xss')</script>"
};

console.log(buildSpecHtml(maliciousSpec));
// Output:
// <span title="User &quot;Name&quot; &amp; Info">&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;</span>
```

---

## ⛔ Void / Self-Closing Element Handling

HTML5 void elements (which do not contain child nodes or closing tags) are automatically compiled into self-closing tags:

Void elements recognized:
`area`, `base`, `br`, `col`, `embed`, `hr`, `img`, `input`, `link`, `meta`, `param`, `source`, `track`, `wbr`

```javascript
const inputSpec = {
    tagName: "input",
    attributes: { type: "text", name: "query" }
};

console.log(buildSpecHtml(inputSpec));
// Output: <input type="text" name="query" />
```

---

[← Back to Main README](../README.md) | [Architecture Guide](ARCHITECTURE.md) | [API Reference](API.md) | [JSON-Driven Rendering](JSON_DRIVEN_RENDERING.md) | [Form Guide](FORM.md)
