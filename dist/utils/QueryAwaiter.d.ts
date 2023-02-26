import type { XPathQuery, QueryCallback } from "types/UtilityTypes";
import type { IPageUtils } from "types/Interfaces";
export default class QueryAwaiter {
    static readonly DEFAULY_AWAITER_OPTIONS: {
        ObserverClass: typeof MutationObserver;
        pageUtils: IPageUtils;
        target: QueryAwaiter["target"];
        autoStart: boolean;
    };
    observerInstance: MutationObserver;
    pageUtils: IPageUtils;
    queries: {
        query?: string;
        xpath?: XPathQuery;
        callback: QueryCallback;
    }[];
    target: Node;
    constructor(options?: Partial<typeof QueryAwaiter.DEFAULY_AWAITER_OPTIONS>);
    onMutation(): void;
    addQuery(query: string, callback: QueryCallback<NodeList>): void;
    addXpath(xpath: XPathQuery, callback: QueryCallback<XPathResult>): void;
    start(): void;
    stop(): void;
}
