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

    describe("5. renderPipeline Component Engine (v6)", () => {
        test("should run render tasks and remove #tableSearchInput DOM element when inShowSearch is false", async () => {
            const { createSearchTask, runRenderPipeline } = await import("../webComponents/v5/core/controls/table/v6/renderPipeline/index.js");
            
            // Mock container element with search input child
            const mockSearchInput = { id: "tableSearchInput", removed: false, remove() { this.removed = true; } };
            const mockSkeleton = {
                querySelector(selector) {
                    if (selector === "#tableSearchInput") return mockSearchInput;
                    return null;
                }
            };

            const searchTask = createSearchTask({ inShowSearch: false });
            runRenderPipeline({
                inContext: { inSkeletonElement: mockSkeleton },
                inPipeline: [searchTask]
            });

            assert.equal(mockSearchInput.removed, true);
        });
    });

    describe("6. resolveTableOptions Options Resolver (v7)", () => {
        test("should normalize input options and produce structured config buckets", async () => {
            const { resolveTableOptions } = await import("../webComponents/v5/core/controls/table/v7/options/resolveTableOptions.js");

            const options = resolveTableOptions({
                inRows: [{ item: "X" }],
                inShowSearch: false,
                inTheme: "dark"
            });

            assert.deepEqual(options.rows, [{ item: "X" }]);
            assert.equal(options.showSearch, false);
            assert.equal(options.skeletonOptions.inTheme, "dark");
            assert.equal(options.skeletonOptions.inShowSearch, undefined); // Skeleton pipeline stays separate
            assert.ok(Array.isArray(options.renderPipeline));
        });
        describe("7. renderPipeline Toolbar Removal (v8)", () => {
            test("should remove entire .table-toolbar element when inShowSearch is false in v8", async () => {
                const { createSearchTask, runRenderPipeline } = await import("../webComponents/v5/core/controls/table/v8/renderPipeline/index.js");
                
                const mockToolbar = { classList: ["table-toolbar"], removed: false, remove() { this.removed = true; } };
                const mockSkeleton = {
                    querySelector(selector) {
                        if (selector === ".table-toolbar") return mockToolbar;
                        return null;
                    }
                };

                const searchTask = createSearchTask({ inShowSearch: false });
                runRenderPipeline({
                    inContext: { inSkeletonElement: mockSkeleton },
                    inPipeline: [searchTask]
                });

                assert.equal(mockToolbar.removed, true);
            });
        });

        describe("8. Responsibility-Grouped Options Resolver (v9)", () => {
            test("should resolve grouped responsibility objects (inTable, inTheme, inVisibility, inEvents)", async () => {
                const { resolveTableOptions } = await import("../webComponents/v5/core/controls/table/v9/options/resolveTableOptions.js");

                const options = resolveTableOptions({
                    inTable: { inRows: [{ item: "GroupedRow" }] },
                    inTheme: { inTheme: "dark" },
                    inVisibility: { inShowSearch: false, inShowFooter: false },
                    inEvents: { inOnRowClick: () => {} }
                });

                assert.equal(options.table.rows.length, 1);
                assert.equal(options.table.rows[0].item, "GroupedRow");
                assert.equal(options.theme.theme, "dark");
                assert.equal(options.visibility.showSearch, false);
                assert.equal(options.visibility.showFooter, false);
                assert.equal(typeof options.events.onRowClick, "function");
            });
        });

        describe("9. Footer v2 & summaryRow/v3 (Two-Phase Architecture)", () => {

            test("should calculate summary row data object in Phase 1 and build row spec in Phase 2", async () => {
                const { buildFooter } = await import("../webComponents/v6/core/controls/table/v22/renderPipeline/tasks/tableTask/footer/v2/index.js");
                const { getObject, getRow } = await import("../webComponents/v6/core/controls/table/v22/renderPipeline/tasks/tableTask/footer/v2/summaryRow/v3/index.js");

                const columns = ["StockItemName", "StockParentName", "Rate"];
                const data = [
                    { StockItemName: "Item 1", StockParentName: "Parent A", Rate: 500 },
                    { StockItemName: "Item 2", StockParentName: "Parent A", Rate: 200 }
                ];
                const summaryConfig = {
                    StockItemName: "count",
                    StockParentName: "max",
                    Rate: "min"
                };

                // Phase 1 test: getObject returns pure data object
                const summaryObj = getObject({
                    inSummaryConfig: summaryConfig,
                    inColumns: columns,
                    inData: data
                });

                assert.deepEqual(summaryObj, {
                    StockItemName: "2",
                    StockParentName: "0",
                    Rate: "200"
                });

                // Phase 2 test: getRow builds spec from data object
                const trSpec = { tagName: "tr", children: [] };
                const thSpec = { tagName: "th", textContent: "" };

                const rowSpec = getRow({
                    inSummaryDataObject: summaryObj,
                    inColumns: columns,
                    inTrSpec: trSpec,
                    inThSpec: thSpec
                });

                assert.equal(rowSpec.children.length, 3);
                assert.equal(rowSpec.children[0].textContent, "2");
                assert.equal(rowSpec.children[2].textContent, "200");

                // Orchestrator test: buildFooter
                const footerRows = buildFooter({
                    inHasFooterConfig: true,
                    inFooterConfig: {
                        summaryRow: summaryConfig,
                        balanceRow: { StockItemName: "StockItemName" }
                    },
                    inColumns: columns,
                    inData: data,
                    inTrSpec: trSpec,
                    inThSpec: thSpec
                });

                assert.equal(footerRows.length, 2);
                assert.equal(footerRows[0].children[0].textContent, "2");
                assert.equal(footerRows[0].children[2].textContent, "200");
            });

            test("should evaluate balance row formulas like Credit-Debit using summaryRowObject", async () => {
                const { buildFooter } = await import("../webComponents/v6/core/controls/table/v22/renderPipeline/tasks/tableTask/footer/v2/index.js");

                const columns = ["StockItemName", "Credit", "Debit"];
                const data = [
                    { StockItemName: "Item 1", Credit: 500, Debit: 250 },
                    { StockItemName: "Item 2", Credit: 450, Debit: 150 }
                ];
                const summaryConfig = {
                    StockItemName: "count",
                    Credit: "sum",
                    Debit: "sum"
                };
                const balanceConfig = {
                    StockItemName: "StockItemName",
                    Credit: "Credit-Debit",
                    Debit: "Debit-Credit"
                };

                const trSpec = { tagName: "tr", children: [] };
                const thSpec = { tagName: "th", textContent: "" };

                const footerRows = buildFooter({
                    inHasFooterConfig: true,
                    inFooterConfig: {
                        summaryRow: summaryConfig,
                        balanceRow: balanceConfig
                    },
                    inColumns: columns,
                    inData: data,
                    inTrSpec: trSpec,
                    inThSpec: thSpec
                });

                assert.equal(footerRows.length, 2);
                // Summary row: Credit = 950, Debit = 400
                assert.equal(footerRows[0].children[1].textContent, "950");
                assert.equal(footerRows[0].children[2].textContent, "400");
                // Balance row: Credit = 950 - 400 = 550, Debit = 400 - 950 = -550
                assert.equal(footerRows[1].children[1].textContent, "550");
                assert.equal(footerRows[1].children[2].textContent, "-550");
            });
        });


    });
});


