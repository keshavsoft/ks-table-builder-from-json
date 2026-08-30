import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Core Controls & Utilities (v3)
import { prepareTableData } from "../webComponents/v3/core/controls/table/v1/userUI/prepareTableData.js";
import { resolveColumns } from "../webComponents/v3/core/controls/table/v1/userUI/resolveColumns.js";
import { buildHeaderRowSpec } from "../webComponents/v3/core/controls/table/v1/userUI/buildHeaderRowSpec.js";
import buildSpecHtml from "../webComponents/v3/htmlCreation/v1/buildSpecHtml.js";
import applyTheme from "../webComponents/v3/core/controls/table/v1/skeleton/applyTheme.js";
import { pullInlineAttributes, resolveConfiguration } from "../webComponents/v3/core/pullAttributes.js";

describe("ks-table-builder-from-json Unit Test Suite", () => {

    describe("1. prepareTableData Mapper", () => {
        test("should compute 1-based serialNo for each row record", () => {
            const inputRows = [
                { StockItemName: "Fabric A", StockParentName: "Parent A", Uom: "m" },
                { StockItemName: "Fabric B", StockParentName: "Parent B", Uom: "kg" }
            ];

            const prepared = prepareTableData({ inRows: inputRows });

            assert.equal(prepared.length, 2);
            assert.equal(prepared[0].serialNo, 1);
            assert.equal(prepared[1].serialNo, 2);
            assert.equal(prepared[0].StockItemName, "Fabric A");
            assert.equal(prepared[1].StockItemName, "Fabric B");
        });

        test("should dynamically resolve column headers from arbitrary JSON rows", () => {
            const customRows = [
                { productName: "Laptop", category: "Electronics", price: "$999" }
            ];

            const columns = resolveColumns({ inRows: customRows });
            assert.equal(columns.length, 3);
            assert.equal(columns[0].label, "Product Name");
            assert.equal(columns[1].label, "Category");
            assert.equal(columns[2].label, "Price");

            const headerSpec = buildHeaderRowSpec({ inColumns: columns, inShowSerial: true });
            assert.equal(headerSpec.children.length, 4); // # + 3 columns
            assert.equal(headerSpec.children[0].textContent, "#");
            assert.equal(headerSpec.children[1].textContent, "Product Name");
        });

        test("should handle empty or null row inputs gracefully", () => {
            assert.deepEqual(prepareTableData({ inRows: null }), []);
            assert.deepEqual(prepareTableData({ inRows: undefined }), []);
            assert.deepEqual(prepareTableData({ inRows: [] }), []);
        });
    });

    describe("2. buildSpecHtml (SSR HTML Compiler)", () => {
        test("should compile JSON spec tree into HTML string", () => {
            const spec = {
                tagName: "div",
                attributes: { class: "container p-4" },
                children: [
                    {
                        tagName: "h1",
                        attributes: { class: "title" },
                        textContent: "Welcome"
                    }
                ]
            };

            const html = buildSpecHtml(spec);
            assert.equal(html, '<div class="container p-4"><h1 class="title">Welcome</h1></div>');
        });

        test("should properly handle self-closing void elements (e.g. input, img)", () => {
            const inputSpec = {
                tagName: "input",
                attributes: { type: "text", name: "username", placeholder: "Enter name" }
            };

            const html = buildSpecHtml(inputSpec);
            assert.equal(html, '<input type="text" name="username" placeholder="Enter name" />');
        });

        test("should sanitize and escape malicious text and attribute values", () => {
            const maliciousSpec = {
                tagName: "span",
                attributes: { title: 'User "Name" & Info' },
                textContent: "<script>alert('xss')</script>"
            };

            const html = buildSpecHtml(maliciousSpec);
            assert.ok(html.includes('&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;'));
            assert.ok(html.includes('title="User &quot;Name&quot; &amp; Info"'));
        });
    });

    describe("3. applyTheme Spec Merger", () => {
        test("should recursively merge theme class attributes into layout spec", () => {
            const layoutSpec = {
                tagName: "div",
                attributes: { class: "base-wrapper" },
                children: [
                    { tagName: "table", attributes: { class: "base-table" } }
                ]
            };

            const themeSpec = {
                attributes: { class: "themed-wrapper bg-slate-900" },
                children: [
                    { attributes: { class: "themed-table border-slate-700" } }
                ]
            };

            const merged = applyTheme({ inSpec: layoutSpec, inThemeSpec: themeSpec });

            assert.equal(merged.attributes.class, "themed-wrapper bg-slate-900");
            assert.equal(merged.children[0].attributes.class, "themed-table border-slate-700");
        });

        test("should preserve original spec if theme spec is null or empty", () => {
            const layoutSpec = {
                tagName: "div",
                attributes: { class: "base-wrapper" }
            };

            const merged = applyTheme({ inSpec: layoutSpec, inThemeSpec: null });
            assert.deepEqual(merged, layoutSpec);
        });
    });

    describe("4. pullAttributes Parser", () => {
        test("should extract inline ks- prefixed attributes", () => {
            const mockContext = {
                attributes: [
                    { name: "ks-theme", value: "dark" },
                    { name: "ks-type", value: "table" },
                    { name: "id", value: "my-elem" }
                ]
            };

            const extracted = pullInlineAttributes({ inContext: mockContext });
            assert.deepEqual(extracted, {
                theme: "dark",
                type: "table"
            });
        });

        test("should merge inline attributes with JS config object", () => {
            const mockContext = {
                attributes: [
                    { name: "ks-theme", value: "light" }
                ],
                config: {
                    inRows: [{ item: "A" }]
                }
            };

            const resolved = resolveConfiguration({ inContext: mockContext });
            assert.equal(resolved.theme, "light");
            assert.deepEqual(resolved.inRows, [{ item: "A" }]);
        });
    });

});
