# 📘 Developer Guide: Understanding `in-*` and `local-*` Naming Conventions

This project enforces a strict naming convention to make code **clear, maintainable, and scalable**:

- **`in-*`** → External inputs (parameters, props, API data)
- **`local-*`** → Internal state or derived variables

---

## 🔑 Why This Matters for Developers

### 1. Clear Data Flow
Prefixes immediately tell you whether a variable is **coming from outside** or **computed inside**.

```javascript
function renderTable(in-data, in-config) {
  let local-rows = normalizeData(in-data);
  let local-theme = applyTheme(in-config.theme);

  // - in-data: external dataset
  // - in-config: external configuration
  // - local-rows: internal transformation
  // - local-theme: derived state
}
