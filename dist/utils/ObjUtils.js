"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBound = exports.bindMethods = void 0;
/**
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 *
 * This function replaces all methods in provided object with versions bound to said object.
 */
function bindMethods(source, bindTo = null, assignTo = null) {
    let sourceProperties = [];
    //If `source` is a plain JS object
    if (source.constructor === Object)
        sourceProperties = Object.keys(source);
    else
        sourceProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(source));
    for (let key of sourceProperties)
        if (key !== "constructor" && typeof source[key] === "function")
            (assignTo !== null && assignTo !== void 0 ? assignTo : source)[key] = source[key].bind(bindTo !== null && bindTo !== void 0 ? bindTo : source);
}
exports.bindMethods = bindMethods;
/**
 * A simple class whose methods are all automatically bound.
 *
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 */
class AutoBound {
    constructor() { bindMethods(this); }
}
exports.AutoBound = AutoBound;
