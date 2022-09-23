"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrToObj = exports.AutoBound = exports.bindMethods = void 0;
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
    if (!bindTo)
        bindTo = source;
    if (!assignTo)
        assignTo = source;
    for (let key of sourceProperties)
        if (key !== "constructor" && typeof source[key] === "function")
            assignTo[key] = source[key].bind(bindTo);
}
exports.bindMethods = bindMethods;
/**
 * A simple class whose methods are all automatically bound.
 *
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 */
class AutoBound {
    constructor() {
        let properties = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (let key of properties)
            if (key !== "constructor" && typeof this[key] === "function")
                this[key] = this[key].bind(this);
    }
}
exports.AutoBound = AutoBound;
function arrToObj(arr, getKey = (_, index) => index.toString(), getValue = elem => elem) {
    const result = {};
    for (let i = 0; i < arr.length; i++)
        result[getKey(arr[i], i, arr)] = getValue(arr[i], i, arr);
    return result;
}
exports.arrToObj = arrToObj;
;
