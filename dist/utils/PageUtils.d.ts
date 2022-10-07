import type { Component, TagMap, AttributeMap } from "../../types/Component";
import type PageModule from "../modules/PageModule";
export declare function queryElement<R extends Element = Element>(query: string): R | null;
export declare function queryAllElements<R extends Element = Element>(query: string): NodeListOf<R>;
export declare function evaluate(...args: Parameters<typeof document.evaluate>): ReturnType<typeof document.evaluate>;
export declare function getSearchParams(url?: URL | Location): {
    [searchParam: string]: string;
};
export declare function removeElementById(id: string | null): void;
export declare function createElement<T extends keyof TagMap = keyof TagMap>(type: T, attributes?: Partial<AttributeMap<T>>): TagMap[T];
export declare function elementize<TagName extends keyof TagMap = keyof TagMap>(component: Component<TagName>): TagMap[TagName];
export declare function render(parentElement: Element | null, components: (Component | Element | Node | string)[], insertAt?: "start" | "end"): void;
export declare function isVisible(element: Element): boolean;
export declare function getIDFor(module: PageModule, ...IDComponents: string[]): string;
