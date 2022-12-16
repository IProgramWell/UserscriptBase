"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindMethods = void 0;
/**
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 *
 * This function replaces all methods in provided object with versions bound to said object.
 */
function bindMethods(options) {
    var _a, _b;
    const bindTo = (_a = options.bindTo) !== null && _a !== void 0 ? _a : options.source, assignTo = options.pure
        ? {}
        : (_b = options.assignTo) !== null && _b !== void 0 ? _b : options.source, 
    //If `source` is a plain JS object
    sourceProperties = options.source.constructor === Object
        ? Object.keys(options.source)
        : Object.getOwnPropertyNames(Object.getPrototypeOf(options.source));
    for (let key of sourceProperties)
        if (key !== "constructor" && typeof options.source[key] === "function")
            assignTo[key] = options.source[key].bind(bindTo);
        else
            assignTo[key] = options.source[key];
    return assignTo;
}
exports.bindMethods = bindMethods;
