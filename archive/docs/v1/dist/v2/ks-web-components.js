//#region webComponents/v2/core/componentRegister.js
function e({ inComponentClass: e, inTagName: t, inVersion: n, inNamespaceKey: r }) {
	let i = e, a = t, o = n, s = r;
	customElements.get(a) || customElements.define(a, i), window.ks = window.ks || {}, window.ks.webComponents = window.ks.webComponents || {}, window.ks.webComponents[s] = window.ks.webComponents[s] || {}, window.ks.webComponents[s][i.name] = i, window.ks.webComponents[s][i.name].version = o;
}
//#endregion
//#region webComponents/v2/core/pullAttributes.js
var t = ({ inContext: e }) => {
	let t = e, n = {};
	if (!t || !t.attributes) return n;
	for (let e of t.attributes) if (e.name.startsWith("ks-")) {
		let t = e.name.slice(3);
		n[t] = e.value;
	}
	return n;
}, n = ({ inContext: e }) => {
	let t = e;
	return t && (t.config || t._config) || {};
}, r = ({ inContext: e }) => {
	let r = e, i = t({ inContext: r }), a = n({ inContext: r });
	return {
		...i,
		...a
	};
}, i = (e) => r({ inContext: e }), a = {
	"aria-described-by": "aria-describedby",
	"aria-label": "aria-label",
	"data-key": "data-key",
	dir: "dir",
	id: "id",
	name: "name",
	role: "role",
	"tab-index": "tabindex",
	title: "title"
}, o = {
	autocomplete: "autocomplete",
	list: "list",
	max: "max",
	"max-length": "maxlength",
	min: "min",
	"min-length": "minlength",
	pattern: "pattern",
	size: "size",
	step: "step"
}, s = ({ inKsAttributes: e }) => {
	let t = e || {}, n = {};
	for (let [e, r] of Object.entries(a)) {
		let i = t[e] ?? t[r];
		i !== void 0 && i !== "" && (n[r] = i);
	}
	let r = t.class || t["class-name"] || t.className;
	return r && (n.class = r), n;
}, c = ({ inKsAttributes: e }) => {
	let t = e || {}, n = {};
	for (let [e, r] of Object.entries(o)) {
		let i = t[e] ?? t[r];
		i !== void 0 && i !== "" && (n[r] = i);
	}
	return n;
}, l = ({ inKsAttributes: e }) => {
	let t = e || {}, n = {}, r = t?.["enter-as-tab"] ?? t?.enterAsTab ?? t?.["ks-enter-as-tab"];
	return (r === "true" || r === !0) && (n.keydown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			let t = Array.from(document.querySelectorAll("input")), n = t.indexOf(e.currentTarget);
			n !== -1 && n < t.length - 1 && t[n + 1].focus();
		}
	}), n;
}, u = ({ inKsAttributes: e }) => {
	let t = e || {}, n = s({ inKsAttributes: t }), r = c({ inKsAttributes: t }), i = l({ inKsAttributes: t });
	return {
		tagName: "input",
		properties: {
			type: t.type || t.inputType || "text",
			value: t.value || "",
			placeholder: t["place-holder"] || t.placeholder || t.inputPlaceholder || ""
		},
		attributes: {
			...n,
			...r
		},
		events: i
	};
}, d = ({ inElement: e, inKeydownFunc: t }) => {
	let n = e, r = t;
	n && n.addEventListener("keydown", (e) => {
		if (typeof r == "function") r(e);
		else if (e.key === "Enter" || e.keyCode === 13) {
			e.preventDefault();
			let t = Array.from(document.querySelectorAll("input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled])")), r = t.indexOf(n);
			r >= 0 && r + 1 < t.length && t[r + 1].focus();
		}
	});
}, f = ({ inElement: e, inKeypressFunc: t }) => {
	let n = e, r = t;
	n && n.addEventListener("keypress", (e) => {
		typeof r == "function" && r(e);
	});
}, p = ({ inElement: e, inKeydownFunc: t, inKeypressFunc: n }) => {
	let r = e, i = t, a = n;
	r && (d({
		inElement: r,
		inKeydownFunc: i
	}), f({
		inElement: r,
		inKeypressFunc: a
	}));
}, m = ({ inSpec: e, inControlType: t, inThemeName: n, inClassList: r }) => {
	let i = e;
	if (!i || !i.tagName) return null;
	let a = document.createElement(i.tagName);
	return i.tagName === "input" && p({
		inElement: a,
		inKeydownFunc: i.events?.keydown,
		inKeypressFunc: i.events?.keypress
	}), i.textContent && (a.textContent = i.textContent), i.properties && Object.assign(a, i.properties), i.attributes && Object.entries(i.attributes).forEach(([e, t]) => {
		e === "class" ? a.className = t : a.setAttribute(e, t);
	}), r && a.classList.add(...r.split(/\s+/).filter(Boolean)), i.events && typeof i.events == "object" && Object.entries(i.events).forEach(([e, t]) => {
		(i.tagName !== "input" || e !== "keydown" && e !== "keypress") && a.addEventListener(e, t);
	}), Array.isArray(i.children) && i.children.forEach((e) => {
		e instanceof Node && a.appendChild(e);
	}), a;
}, h = (e) => {
	if (!e) return null;
	if (e instanceof Node) return e;
	if (Array.isArray(e)) return e.map((e) => h(e)).flat().filter(Boolean);
	if (typeof e != "object") return null;
	let t = Array.isArray(e.children) ? e.children.map((e) => h(e)).flat().filter(Boolean) : [];
	return m({ inSpec: {
		...e,
		children: t
	} });
}, g = {
	tagName: "div",
	attributes: { class: "table-wrapper space-y-3" },
	children: [{
		tagName: "div",
		attributes: { class: "table-toolbar flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm" },
		children: [{
			tagName: "div",
			attributes: { class: "flex items-center space-x-2" },
			children: [{
				tagName: "span",
				attributes: { class: "text-sm font-semibold text-gray-700" },
				textContent: "Stock Items"
			}]
		}, {
			tagName: "input",
			attributes: {
				type: "text",
				id: "tableSearchInput",
				placeholder: "🔍 Search stock items...",
				class: "border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
			}
		}]
	}, {
		tagName: "table",
		attributes: { class: "w-full border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden bg-white" },
		children: [{
			tagName: "thead",
			attributes: { class: "bg-gray-100 border-b border-gray-300" },
			children: [{
				tagName: "tr",
				attributes: { class: "text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" },
				children: [
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-200 w-12" },
						textContent: "#"
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-200" },
						textContent: "Stock Item Name"
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-200" },
						textContent: "Stock Parent Name"
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3" },
						textContent: "UOM"
					}
				]
			}]
		}, {
			tagName: "tbody",
			attributes: {
				slot: "body",
				class: "divide-y divide-gray-200 text-sm text-gray-800"
			},
			children: []
		}]
	}]
}, _ = {
	tagName: "div",
	attributes: { class: "table-wrapper space-y-3" },
	children: [{
		tagName: "div",
		attributes: { class: "table-toolbar flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-sm" },
		children: [{
			tagName: "div",
			attributes: { class: "flex items-center space-x-2" },
			children: [{
				tagName: "span",
				attributes: { class: "text-sm font-semibold text-gray-200" }
			}]
		}, {
			tagName: "input",
			attributes: { class: "bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 placeholder-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" }
		}]
	}, {
		tagName: "table",
		attributes: { class: "w-full border-collapse border border-gray-700 shadow-sm rounded-lg overflow-hidden bg-gray-900" },
		children: [{
			tagName: "thead",
			attributes: { class: "bg-gray-800 border-b border-gray-700" },
			children: [{
				tagName: "tr",
				attributes: { class: "text-left text-xs font-semibold text-gray-300 uppercase tracking-wider" },
				children: [
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-700 w-12" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-700" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-700" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3" }
					}
				]
			}]
		}, {
			tagName: "tbody",
			attributes: {
				slot: "body",
				class: "divide-y divide-gray-700 text-sm text-gray-200"
			},
			children: []
		}]
	}]
}, v = {
	tagName: "div",
	attributes: { class: "table-wrapper space-y-3" },
	children: [{
		tagName: "div",
		attributes: { class: "table-toolbar flex justify-between items-center bg-black p-3 rounded-lg border border-zinc-800 shadow-sm" },
		children: [{
			tagName: "div",
			attributes: { class: "flex items-center space-x-2" },
			children: [{
				tagName: "span",
				attributes: { class: "text-sm font-semibold text-zinc-100" }
			}]
		}, {
			tagName: "input",
			attributes: { class: "bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 w-64 focus:outline-none focus:ring-2 focus:ring-zinc-600" }
		}]
	}, {
		tagName: "table",
		attributes: { class: "w-full border-collapse border border-zinc-800 shadow-sm rounded-lg overflow-hidden bg-black" },
		children: [{
			tagName: "thead",
			attributes: { class: "bg-zinc-900 border-b border-zinc-800" },
			children: [{
				tagName: "tr",
				attributes: { class: "text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider" },
				children: [
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-zinc-800 w-12" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-zinc-800" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-zinc-800" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3" }
					}
				]
			}]
		}, {
			tagName: "tbody",
			attributes: {
				slot: "body",
				class: "divide-y divide-zinc-800 text-sm text-zinc-200"
			},
			children: []
		}]
	}]
}, y = {
	tagName: "div",
	attributes: { class: "table-wrapper space-y-3" },
	children: [{
		tagName: "div",
		attributes: { class: "table-toolbar flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-xs" },
		children: [{
			tagName: "div",
			attributes: { class: "flex items-center space-x-2" },
			children: [{
				tagName: "span",
				attributes: { class: "text-sm font-medium text-slate-600" }
			}]
		}, {
			tagName: "input",
			attributes: { class: "bg-slate-50/60 border border-slate-200 rounded px-3 py-1.5 text-sm text-slate-600 placeholder-slate-300 w-64 focus:outline-none focus:ring-2 focus:ring-slate-300" }
		}]
	}, {
		tagName: "table",
		attributes: { class: "w-full border-collapse border border-slate-100 shadow-xs rounded-lg overflow-hidden bg-white" },
		children: [{
			tagName: "thead",
			attributes: { class: "bg-slate-50 border-b border-slate-100" },
			children: [{
				tagName: "tr",
				attributes: { class: "text-left text-xs font-medium text-slate-500 uppercase tracking-wider" },
				children: [
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-slate-100 w-12" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-slate-100" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-slate-100" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3" }
					}
				]
			}]
		}, {
			tagName: "tbody",
			attributes: {
				slot: "body",
				class: "divide-y divide-slate-100 text-sm text-slate-600"
			},
			children: []
		}]
	}]
}, b = {
	tagName: "div",
	attributes: { class: "table-wrapper space-y-3" },
	children: [{
		tagName: "div",
		attributes: { class: "table-toolbar flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm" },
		children: [{
			tagName: "div",
			attributes: { class: "flex items-center space-x-2" },
			children: [{
				tagName: "span",
				attributes: { class: "text-sm font-semibold text-gray-700" }
			}]
		}, {
			tagName: "input",
			attributes: { class: "bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" }
		}]
	}, {
		tagName: "table",
		attributes: { class: "w-full border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden bg-white" },
		children: [{
			tagName: "thead",
			attributes: { class: "bg-gray-100 border-b border-gray-300" },
			children: [{
				tagName: "tr",
				attributes: { class: "text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" },
				children: [
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-200 w-12" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-200" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3 border-r border-gray-200" }
					},
					{
						tagName: "th",
						attributes: { class: "px-4 py-3" }
					}
				]
			}]
		}, {
			tagName: "tbody",
			attributes: {
				slot: "body",
				class: "divide-y divide-gray-200 text-sm text-gray-800"
			},
			children: []
		}]
	}]
}, x = {
	"extra-dark": v,
	dark: _,
	medium: {
		tagName: "div",
		attributes: { class: "table-wrapper space-y-3" },
		children: [{
			tagName: "div",
			attributes: { class: "table-toolbar flex justify-between items-center bg-slate-200 p-3 rounded-lg border border-slate-300 shadow-sm" },
			children: [{
				tagName: "div",
				attributes: { class: "flex items-center space-x-2" },
				children: [{
					tagName: "span",
					attributes: { class: "text-sm font-semibold text-slate-800" }
				}]
			}, {
				tagName: "input",
				attributes: { class: "bg-white border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 w-64 focus:outline-none focus:ring-2 focus:ring-slate-500" }
			}]
		}, {
			tagName: "table",
			attributes: { class: "w-full border-collapse border border-slate-300 shadow-sm rounded-lg overflow-hidden bg-white" },
			children: [{
				tagName: "thead",
				attributes: { class: "bg-slate-300 border-b border-slate-300" },
				children: [{
					tagName: "tr",
					attributes: { class: "text-left text-xs font-semibold text-slate-700 uppercase tracking-wider" },
					children: [
						{
							tagName: "th",
							attributes: { class: "px-4 py-3 border-r border-slate-300 w-12" }
						},
						{
							tagName: "th",
							attributes: { class: "px-4 py-3 border-r border-slate-300" }
						},
						{
							tagName: "th",
							attributes: { class: "px-4 py-3 border-r border-slate-300" }
						},
						{
							tagName: "th",
							attributes: { class: "px-4 py-3" }
						}
					]
				}]
			}, {
				tagName: "tbody",
				attributes: {
					slot: "body",
					class: "divide-y divide-slate-200 text-sm text-slate-700"
				},
				children: []
			}]
		}]
	},
	light: b,
	"extra-light": y,
	default: b
}, S = ({ inTheme: e, inThemeName: t, inThemeSpec: n }) => {
	let r = n, i = typeof e == "string" ? e : t;
	return r && typeof r == "object" ? r : typeof e == "object" && e ? e : i && x[i] ? x[i] : x.default;
}, C = ({ inSpec: e, inThemeSpec: t }) => {
	let n = e, r = t;
	if (!n || typeof n != "object" || !r || typeof r != "object") return n;
	let i = { ...n.attributes || {} };
	r.attributes && r.attributes.class && (i.class = r.attributes.class);
	let a = Array.isArray(n.children) ? n.children : [], o = Array.isArray(r.children) ? r.children : [], s = a.map((e, t) => {
		let n = o[t];
		return C({
			inSpec: e,
			inThemeSpec: n
		});
	});
	return {
		...n,
		attributes: i,
		children: s
	};
}, w = ({ inSpec: e, inTheme: t, inThemeName: n, inThemeSpec: r }) => {
	let i = e || g, a = S({
		inTheme: t,
		inThemeName: n,
		inThemeSpec: r
	});
	return h(a ? C({
		inSpec: i,
		inThemeSpec: a
	}) : i);
}, T = ({ inTableElement: e, inOnSearch: t, inOnRowClick: n }) => {
	let r = e, i = t, a = n;
	if (!r) return;
	let o = r.querySelector("#tableSearchInput") || r.querySelector("input[type='text']");
	o && typeof i == "function" && o.addEventListener("input", (e) => {
		let t = e.target.value || "";
		i({
			inQuery: t,
			inEvent: e
		});
	}), typeof a == "function" && r.addEventListener("click", (e) => {
		let t = e.target.closest("tr");
		t && t.parentElement.tagName.toLowerCase() === "tbody" && a({
			inRowElement: t,
			inEvent: e
		});
	});
}, E = ({ inRows: e }) => (e || []).map((e, t) => ({
	...e,
	serialNo: t + 1,
	StockItemName: e.StockItemName || "",
	StockParentName: e.StockParentName || "",
	Uom: e.Uom || e.StockBaseUnits || ""
})), D = ({ inRowData: e }) => {
	let t = e || {}, n = t.serialNo || 1;
	return {
		tagName: "tr",
		attributes: { class: "hover:bg-gray-50 transition-colors border-b border-gray-200 cursor-pointer" },
		children: [
			{
				tagName: "td",
				attributes: { class: "px-4 py-3 border-r border-gray-200 font-mono text-xs text-gray-500 w-12 text-center" },
				textContent: String(n)
			},
			{
				tagName: "td",
				attributes: { class: "px-4 py-3 border-r border-gray-200 font-medium text-gray-900" },
				textContent: t.StockItemName
			},
			{
				tagName: "td",
				attributes: { class: "px-4 py-3 border-r border-gray-200 text-gray-600" },
				textContent: t.StockParentName
			},
			{
				tagName: "td",
				attributes: { class: "px-4 py-3 text-gray-600" },
				textContent: t.Uom
			}
		]
	};
}, O = ({ inSkeletonElement: e, inTarget: t, inRows: n }) => {
	let r = e, i = t, a = n || [], o = null;
	r instanceof Node ? o = r : typeof i == "string" ? o = document.querySelector(i) : typeof r == "string" && (o = document.querySelector(r)), o ||= document.querySelector("tbody[slot=\"body\"]") || document.querySelector("tbody") || document.body;
	let s = o instanceof Node && o.tagName?.toLowerCase() === "tbody" ? o : o.querySelector?.("tbody[slot=\"body\"]") || o.querySelector?.("tbody") || o;
	s && typeof s.replaceChildren == "function" && s.replaceChildren();
	let c = h(E({ inRows: a }).map((e) => D({ inRowData: e })));
	return Array.isArray(c) ? c.forEach((e) => s.appendChild(e)) : c instanceof Node && s.appendChild(c), o;
}, k = ({ inTableElement: e, inTarget: t, inRows: n }) => {
	let r = e, i = t, a = n || [], o = null;
	if (r instanceof Node ? o = r : typeof i == "string" ? o = document.querySelector(i) : typeof r == "string" && (o = document.querySelector(r)), !o) return;
	let s = (o.querySelector("tbody") || o).querySelectorAll("tr");
	a.forEach((e, t) => {
		let n = s[t];
		if (!n) return;
		let r = n.querySelectorAll("td");
		r[1] && (r[1].textContent = e.StockItemName || ""), r[2] && (r[2].textContent = e.StockParentName || ""), r[3] && (r[3].textContent = e.Uom || "");
	});
}, A = ({ inSpec: e, inTheme: t, inThemeName: n, inThemeSpec: r, inRows: i, inOnRowClick: a, inOnSearch: o }) => {
	let s = e, c = t, l = n, u = r, d = i || [], f = a, p = o, m = w({
		inSpec: s,
		inTheme: c,
		inThemeName: l,
		inThemeSpec: u
	});
	return T({
		inTableElement: m,
		inOnSearch: ({ inQuery: e, inEvent: t }) => {
			let n = (e || "").toLowerCase(), r = d.filter((e) => {
				let t = (e.StockItemName || "").toLowerCase(), r = (e.StockParentName || "").toLowerCase(), i = (e.Uom || e.StockBaseUnits || "").toLowerCase();
				return t.includes(n) || r.includes(n) || i.includes(n);
			});
			O({
				inSkeletonElement: m,
				inRows: r
			}), typeof p == "function" && p({
				inQuery: e,
				inFilteredRows: r,
				inEvent: t
			});
		},
		inOnRowClick: f
	}), O({
		inSkeletonElement: m,
		inRows: d
	}), m;
}, j = {
	default: {
		button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
		input: "border border-gray-300 rounded px-3 py-2",
		checkbox: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded",
		label: "block text-sm font-medium text-gray-700",
		table: {
			table: "w-full border-collapse border border-gray-300 my-4",
			thead: "",
			th: "border border-gray-300 px-4 py-2 bg-gray-100 text-left text-sm font-semibold text-gray-700",
			tbody: "",
			td: "border border-gray-300 px-4 py-2 text-sm text-gray-800"
		}
	},
	light: {
		button: "bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded border border-gray-300",
		input: "border border-gray-300 bg-white rounded px-3 py-2 text-gray-800",
		checkbox: "w-4 h-4 text-blue-600 bg-white border-gray-300 rounded",
		label: "block text-sm font-medium text-gray-800",
		table: {
			table: "w-full border-collapse border border-gray-200 my-4",
			thead: "",
			th: "border border-gray-200 px-4 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-600",
			tbody: "",
			td: "border border-gray-200 px-4 py-2 text-sm text-gray-700"
		}
	},
	dark: {
		button: "bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded",
		input: "border border-gray-600 bg-gray-800 text-white rounded px-3 py-2",
		checkbox: "w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded",
		label: "block text-sm font-medium text-gray-300",
		table: {
			table: "w-full border-collapse border border-gray-700 my-4 bg-gray-900 text-white",
			thead: "",
			th: "border border-gray-700 px-4 py-2 bg-gray-800 text-left text-sm font-semibold text-gray-200",
			tbody: "",
			td: "border border-gray-700 px-4 py-2 text-sm text-gray-300"
		}
	}
}, M = {
	input: u,
	table: A
}, N = ({ inConfig: e, inFallbackControlType: t }) => {
	let n = e || {}, r = n["control-type"] || n.controlType || t || "input", i = M[r] || u;
	if (r === "table") return i({ inKsAttributes: n });
	let a = i({ inKsAttributes: n }), o = n.theme || "default", s = j[o]?.[r];
	return m({
		inSpec: a,
		inControlType: r,
		inThemeName: o,
		inClassList: s
	});
}, P = ({ inConfig: e, inKey: t, inInferredType: n }) => {
	let r = e || {}, i = r["control-type"] || r.controlType || r.type || n;
	return i === "table" || r.headers || r.rows ? N({
		inConfig: r,
		inFallbackControlType: "table"
	}) : i && M[i] ? N({
		inConfig: r,
		inFallbackControlType: i
	}) : typeof r == "object" && r && Object.keys(r).length > 0 ? N({
		inConfig: r,
		inFallbackControlType: "input"
	}) : null;
}, F = {
	tagName: "form",
	attributes: { class: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4 border border-gray-200" },
	children: [
		{
			tagName: "div",
			attributes: { class: "form-header pb-3 border-b border-gray-200" },
			children: [{
				tagName: "h2",
				attributes: { class: "text-lg font-bold text-gray-800" },
				textContent: "User Registration (v7 Skeleton Architecture)"
			}]
		},
		{
			tagName: "div",
			attributes: {
				slot: "body",
				class: "form-body py-3 space-y-4"
			},
			children: []
		},
		{
			tagName: "div",
			attributes: { class: "form-footer pt-3 border-t border-gray-200 space-y-2" },
			children: [{
				tagName: "button",
				attributes: {
					type: "submit",
					class: "w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
				},
				textContent: "Submit Form"
			}]
		}
	]
}, I = ({ inSpec: e }) => h(e || F), L = /* @__PURE__ */ new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]), R = (e) => typeof e == "string" ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;") : e || "", z = (e) => {
	let t = e;
	if (!t) return "";
	if (Array.isArray(t)) return t.map((e) => z(e)).join("\n");
	if (typeof t != "object" || !t.tagName) return "";
	let n = t.tagName.toLowerCase(), r = "";
	if (t.attributes && typeof t.attributes == "object") {
		let e = Object.entries(t.attributes).map(([e, t]) => `${e}="${R(String(t))}"`).join(" ");
		e && (r = " " + e);
	}
	if (L.has(n)) return `<${n}${r} />`;
	let i = "";
	if (t.textContent && (i += R(t.textContent)), Array.isArray(t.children) && t.children.length > 0) {
		let e = t.children.map((e) => z(e)).filter(Boolean).join("\n");
		e && (i += (i ? "\n" : "") + e);
	}
	return `<${n}${r}>${i}</${n}>`;
}, B = ({ inSpec: e }) => z(e || F), V = ({ inFormElement: e }) => {
	let t = e;
	if (!t) return {};
	let n = {};
	return t.querySelectorAll("input, select, textarea").forEach((e) => {
		e.name && (n[e.name] = e.value);
	}), n;
}, H = ({ inFormElement: e, inOnSubmit: t }) => {
	let n = e, r = t;
	!n || typeof r != "function" || n.addEventListener("submit", (e) => {
		e.preventDefault();
		let t = V({ inFormElement: n });
		r({
			inFormData: t,
			inEvent: e
		});
	});
}, U = ({ inField: e }) => {
	let t = e || {}, n = t.name || "", r = t.label || n, i = t.type || "text", a = t.placeholder || `Enter ${r.toLowerCase()}`;
	return {
		tagName: "div",
		attributes: { class: "form-group flex flex-col space-y-1" },
		children: [{
			tagName: "label",
			attributes: {
				class: "block text-sm font-medium text-gray-700",
				for: n
			},
			textContent: r
		}, {
			tagName: "input",
			attributes: {
				type: i,
				id: n,
				name: n,
				placeholder: a,
				class: "border border-gray-300 bg-white rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
			}
		}]
	};
}, W = ({ inSkeletonElement: e, inTarget: t, inFields: n }) => {
	let r = e, i = t, a = n || [], o = null;
	r instanceof Node ? o = r : typeof i == "string" ? o = document.querySelector(i) : typeof r == "string" && (o = document.querySelector(r)), o ||= document.querySelector("[slot=\"body\"]") || document.body;
	let s = o instanceof Node && o.querySelector && (o.querySelector("[slot=\"body\"]") || o.querySelector(".form-body")) || o, c = h(a.map((e) => U({ inField: e })));
	return Array.isArray(c) ? c.forEach((e) => s.appendChild(e)) : c instanceof Node && s.appendChild(c), o;
}, G = ({ inFormElement: e, inTarget: t, inData: n }) => {
	let r = e, i = t, a = n || {}, o = null;
	r instanceof Node ? o = r : typeof i == "string" ? o = document.querySelector(i) : typeof r == "string" && (o = document.querySelector(r)), o && Object.entries(a).forEach(([e, t]) => {
		let n = o.querySelector(`[name="${e}"]`);
		n && (n.value = t);
	});
}, K = ({ inSpec: e, inFields: t, inData: n, inOnSubmit: r }) => {
	let i = e, a = t || [], o = n, s = r, c = I({ inSpec: i });
	return H({
		inFormElement: c,
		inOnSubmit: s
	}), W({
		inSkeletonElement: c,
		inFields: a
	}), o && Object.keys(o).length > 0 && G({
		inFormElement: c,
		inData: o
	}), c;
}, q = {
	renderTable: A,
	renderForm: K,
	registerComponent: e,
	pullAttributes: i,
	resolveSpec: P
};
//#endregion
export { H as bindFormSkeletonEvents, T as bindTableSkeletonEvents, q as default, V as extractFormData, G as hydrateFormData, k as hydrateTableData, E as prepareTableData, i as pullAttributes, e as registerComponent, K as renderForm, I as renderFormSkeleton, B as renderFormSkeletonHtml, W as renderFormUserUI, A as renderTable, w as renderTableSkeleton, O as renderTableUserUI, P as resolveSpec };
