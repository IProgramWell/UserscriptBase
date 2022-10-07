"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIDFor = exports.isVisible = exports.render = exports.elementize = exports.createElement = exports.removeElementById = exports.getSearchParams = exports.queryAllElements = exports.queryElement = void 0;
const ObjUtils_1 = require("./ObjUtils");
function queryElement(query) {
    return document.querySelector(query);
}
exports.queryElement = queryElement;
function queryAllElements(query) {
    return document.querySelectorAll(query);
}
exports.queryAllElements = queryAllElements;
function getSearchParams(url = document.location) {
    return (0, ObjUtils_1.arrToObj)(url
        .search
        .substring(1)
        .split("&"), param => param.substring(0, param.indexOf("=")), param => param.substring(param.indexOf("=") + 1));
}
exports.getSearchParams = getSearchParams;
function removeElementById(id) {
    var _a, _b;
    if (!id)
        return;
    (_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.remove) === null || _b === void 0 ? void 0 : _b.call(_a);
}
exports.removeElementById = removeElementById;
;
function createElement(type, attributes = {}) {
    return Object.assign(document.createElement(type), attributes);
}
exports.createElement = createElement;
function elementize(component) {
    const [tagName, attributes, ...children] = component;
    const element = createElement(tagName, attributes !== null && attributes !== void 0 ? attributes : {});
    const elementChildren = children === null || children === void 0 ? void 0 : children.reduce((elems, child) => {
        if (child !== null && child !== undefined) {
            switch (typeof child) {
                case "string":
                    elems.push(child);
                    break;
                case "object":
                    if (Array.isArray(child))
                        elems.push(elementize(child));
                    else
                        elems.push(child);
                    break;
                default:
                    elems.push(`${child}`);
                    break;
            }
        }
        return elems;
    }, []);
    if (elementChildren && elementChildren.length > 0) {
        element.append(...elementChildren);
    }
    return element;
}
exports.elementize = elementize;
function render(parentElement, components, insertAt = "end") {
    if (!parentElement || !components || components.length === 0)
        return;
    const elements = [];
    for (let comp of components) {
        if (comp !== null &&
            comp !== undefined) {
            if (Array.isArray(comp))
                elements.push(elementize(comp));
            else
                elements.push(comp);
        }
    }
    switch (insertAt) {
        case "start":
            parentElement.prepend(...elements);
            break;
        case "end":
        default:
            parentElement.append(...elements);
            break;
    }
}
exports.render = render;
function isVisible(element) {
    let style = globalThis.getComputedStyle(element);
    return (style.display !== "none" &&
        style.visibility !== "hidden");
}
exports.isVisible = isVisible;
function getIDFor(module, ...IDComponents) {
    var _a, _b;
    const scriptName = (_b = (_a = globalThis.GM_info) === null || _a === void 0 ? void 0 : _a.script) === null || _b === void 0 ? void 0 : _b.name, { moduleName } = module;
    return [
        scriptName,
        moduleName
    ]
        .concat(...IDComponents)
        .filter(c => c)
        .map(c => Array.from(c.matchAll(/\w+/g)).join(""))
        .join("-");
}
exports.getIDFor = getIDFor;
