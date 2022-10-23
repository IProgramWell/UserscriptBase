import type { TagMap, AttributeMap } from "../../types/ElementTypes";
export declare function queryElement<R extends Element = Element>(query: string): R | null;
export declare function queryAllElements<R extends Element = Element>(query: string): NodeListOf<R>;
export declare function evaluate(expression: string, contextNode: Node, resolver?: XPathNSResolver, type?: number, result?: XPathResult): XPathResult;
export declare function getSearchParams(url?: URL | Location): {
    [searchParam: string]: string;
};
export declare function removeElementById(id: string | null): void;
export declare function createElement<T extends keyof TagMap = keyof TagMap>(type: T, attributes?: Partial<AttributeMap<T>>, children?: (Node | string)[]): TagMap[T];
export declare function isVisible(element: Element): boolean;
export declare function isScriptInIFrame(): boolean;
