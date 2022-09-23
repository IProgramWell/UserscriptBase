import type { TypedObject } from "../../types/GeneralTypes";
/**
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 *
 * This function replaces all methods in provided object with versions bound to said object.
 */
export declare function bindMethods<T extends TypedObject<((...args: any[]) => any) | any> = TypedObject<((...args: any[]) => any) | any>>(source: T, bindTo?: T | null, assignTo?: T | null): void;
/**
 * A simple class whose methods are all automatically bound.
 *
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 */
export declare class AutoBound {
    [key: string]: ((...args: any[]) => any) | any;
    constructor();
}
export declare function arrToObj<T, R = T>(arr: T[], getKey?: (element: T, index: number, array: T[]) => string, getValue?: (element: T, index: number, array: T[]) => (R | T)): Record<string, (R | T)>;
