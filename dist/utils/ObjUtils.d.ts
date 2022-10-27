/**
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 *
 * This function replaces all methods in provided object with versions bound to said object.
 */
export declare function bindMethods<T extends Record<PropertyKey, any> = Record<PropertyKey, any>>(options: {
    source: T;
    assignTo?: T | null;
    bindTo?: T | null;
    pure?: boolean;
}): T;
/**
 * A simple class whose methods are all automatically bound.
 *
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 */
export declare class AutoBound {
    constructor();
}
