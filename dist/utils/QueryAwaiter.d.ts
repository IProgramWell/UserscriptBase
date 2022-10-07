import * as pageUtils from "./PageUtils";
import { AutoBound } from "./ObjUtils";
declare type QueryCallback = (elements: NodeList | XPathResult) => void;
export default class QueryAwaiter extends AutoBound {
    static readonly DEFAULY_AWAITER_OPTIONS: {
        ObserverClass: typeof MutationObserver;
        pageUtils: typeof pageUtils;
        target: QueryAwaiter["target"];
        autoStart: boolean;
    };
    observerInstance: MutationObserver;
    pageUtils: typeof pageUtils;
    queries: {
        query?: string;
        xpath?: {
            xpath: string;
            contextNode?: Node;
            namespaceResolver?: XPathNSResolver;
            resultType?: number;
            result?: XPathResult;
        };
        callback: QueryCallback;
    }[];
    target: Node;
    constructor(options?: Partial<typeof QueryAwaiter.DEFAULY_AWAITER_OPTIONS>);
    onMutation(): void;
    addQuery(query: string, callback: QueryCallback): void;
    addXpath(xpath: QueryAwaiter["queries"][number]["xpath"], callback: QueryCallback): void;
    start(): void;
    stop(): void;
}
export {};
