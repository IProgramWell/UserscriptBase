"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BODY = exports.HEAD = exports.DOCUMENT = exports.isScriptInIFrame = exports.isVisible = exports.createElement = exports.removeElementById = exports.getSearchParams = exports.evaluate = exports.queryAllElements = exports.queryElement = void 0;
function queryElement(query) {
    return document.querySelector(query);
}
exports.queryElement = queryElement;
function queryAllElements(query) {
    return document.querySelectorAll(query);
}
exports.queryAllElements = queryAllElements;
function evaluate(expression, contextNode, resolver, type, result) {
    return document.evaluate(expression, contextNode, resolver, type, result);
}
exports.evaluate = evaluate;
function getSearchParams(url = document.location) {
    const params = {};
    for (let param of url
        .search
        .substring(1)
        .split("&")) {
        params[param.substring(0, param.indexOf("="))] =
            param.substring(param.indexOf("=") + 1);
    }
    return params;
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
function createElement(type, attributes = {}, children) {
    const element = Object.assign(document.createElement(type), attributes);
    if (children)
        element.append(...children);
    return element;
}
exports.createElement = createElement;
function isVisible(element) {
    let style = globalThis.getComputedStyle(element);
    return (style.display !== "none" &&
        style.visibility !== "hidden");
}
exports.isVisible = isVisible;
function isScriptInIFrame() { return globalThis.self !== globalThis.top; }
exports.isScriptInIFrame = isScriptInIFrame;
exports.DOCUMENT = document;
exports.HEAD = document.head;
exports.BODY /* : HTMLBodyElement */ = document.body;
