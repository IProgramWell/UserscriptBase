import type { Component } from "../../types/Component";
export declare function queryElement<R extends Element = Element>(query: string): R | null;
export declare function queryAllElements<R extends Element = Element>(query: string): NodeListOf<R>;
export declare function getSearchParams(url?: URL | Location): {
    [searchParam: string]: string;
};
export declare function removeElementById(id: string | null): void;
export declare function elementize<TagName extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap>(component: Component<TagName>): HTMLElementTagNameMap[TagName];
export declare function render(parentElement: Element | null, components: (Component | Element | Node | string)[], insertAt?: "start" | "end"): void;
