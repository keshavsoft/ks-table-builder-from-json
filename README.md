# ks-table-builder-from-json

> A JSON-driven UI rendering architecture for building Tables, Forms, and other components from declarative specifications.

## Architecture at a Glance

The central idea is:

~~~text
God JSON / UI Specification
          |
          v
   Transformation Pipeline
          |
          |-- Theme
          |-- Header
          |-- Body
          |-- Footer
          |-- Serial / UI columns
          |-- Custom transformations
          |
          v
   Resolved JSON Specification
          |
          v
   Recursive Spec Builder
          |
          v
          DOM
~~~

The important principle is:

**Describe the UI first. Transform the description second. Create the DOM last.**

---

## 1. Declarative UI

The UI is first represented as JSON.

The specification describes:

- element type
- attributes
- properties
- text
- children
- events
- structural relationships

For example:

~~~json
{
  "tagName": "table",
  "children": [
    {
      "tagName": "thead"
    },
    {
      "tagName": "tbody"
    },
    {
      "tagName": "tfoot"
    }
  ]
}
~~~

At this stage, no DOM has been created.

It is only a description of the UI.

---

## 2. Transformation Pipeline

The specification is passed through a sequence of small transformation tasks.

~~~text
Base Spec
   |
   v
Theme
   |
   v
Header
   |
   v
Body
   |
   v
Footer
   |
   v
Serial / UI columns
   |
   v
Custom transformations
   |
   v
Resolved Spec
~~~

Each task has one responsibility.

The generic pipeline runner does not know that it is processing a table.

It simply passes the current specification from one task to the next.

---

## 3. Structure and Appearance Are Separate

The **God Spec** describes the structure.

The **Theme Spec** describes appearance.

~~~text
God Spec
   +
Theme Spec
   |
   v
Transformed Spec
~~~

Themes can be selected by name without exposing framework classes to the consumer.

For example:

~~~js
{
    inTheme: "dark"
}
~~~

The renderer does not need to understand what `"dark"` means.

The theme transformation supplies the appropriate classes.

---

## 4. Recursive DOM Creation

After all transformations are complete, the resolved specification is converted into DOM.

~~~text
JSON Spec
   |
   +--> create element
   |
   +--> apply properties
   |
   +--> apply attributes
   |
   +--> attach events
   |
   +--> recursively build children
   |
   v
DOM Tree
~~~

The recursive builder is generic.

It does not contain table-specific logic.

That means the same DOM infrastructure can later support:

- Table
- Form
- Vertical Form
- Horizontal Form
- Filter UI
- Card UI
- Other components

---

## 5. Table Architecture

The Table is a consumer of this architecture.

A table can be described through:

- data
- columns
- headers
- body
- footers
- UI columns
- search
- serial column
- theme
- rendering options

The table renderer coordinates these pieces.

The generic DOM builder does not know anything about them.

---

## 6. Data and UI Separation

Source data should remain separate from UI-generated information.

Conceptually:

~~~text
data
├── originalData
├── stateData
└── uiData
~~~

For example, serial numbers, selection state, filtered data, or other UI-derived values should not require modifying the original source data.

This keeps the original dataset as the source of truth.

---

## 7. Columns

Columns can follow the same separation.

Conceptually:

~~~text
columns
├── originalColumns
├── uiColumns
├── headerColumns
├── bodyColumns
└── footerColumns
~~~

This allows the table to introduce UI-specific columns such as:

- serial number
- options/actions
- checkbox
- input
- computed values

without changing the fundamental rendering engine.

---

## 8. Section-Specific Configuration

The table naturally consists of:

~~~text
table
├── thead
├── tbody
└── tfoot
~~~

Each section can have its own configuration.

For example:

~~~text
Header columns
Body columns
Footer columns
~~~

This allows a column to exist in one section without requiring it to appear in another.

---

## 9. Web Component Boundary

The Web Component should remain thin.

Conceptually:

~~~text
<ks-table-base>
       |
       v
    config
       |
       v
 table renderer
       |
       v
  resolved DOM
~~~

The component should coordinate the rendering process rather than becoming another DOM engine.

---

## 10. Forms

The same architecture can be reused for Forms.

~~~text
Form Spec
    |
    v
Form Pipeline
    |
    v
Resolved Form Spec
    |
    v
Recursive DOM Builder
    |
    v
Form DOM
~~~

Different presentation styles can then become different renderers:

~~~text
Schema
  |
  +--> Table
  |
  +--> Vertical Form
  |
  +--> Horizontal Form
  |
  +--> Filter Form
~~~

The data/configuration describes the information.

The renderer determines the presentation.

---

## 11. Public API Philosophy

The consumer should ideally provide configuration rather than manually constructing DOM.

For example:

~~~js
const table = renderTable({
    inRows: rows,
    inTheme: "light"
});
~~~

The internal architecture handles:

- specification
- transformations
- themes
- data mapping
- DOM creation
- events
- section rendering

This keeps application code small and declarative.

---

## 12. Documentation

For the detailed internal architecture, see:

**[DETAILS.md](DETAILS.md)**

This README explains the mental model.

`DETAILS.md` follows the runtime flow and explains how the individual layers cooperate.

---

## Core Principle

> **Describe the UI first. Transform the description second. Create the DOM last.**

The Table is currently the main consumer of this architecture.

The larger goal is a reusable foundation where the same specification, transformation, and DOM infrastructure can support multiple UI renderers.