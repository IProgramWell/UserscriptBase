import * as pageUtils from "./PageUtils";
import { AutoBound } from "./ObjUtils";
declare type QueryCallback<R extends NodeList | XPathResult = NodeList | XPathResult> = (elements: R) => void;
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
            isValidResult?(result: XPathResult): boolean;
        };
        callback: QueryCallback;
    }[];
    target: Node;
    constructor(options?: Partial<typeof QueryAwaiter.DEFAULY_AWAITER_OPTIONS>);
    onMutation(): void;
    addQuery(query: string, callback: QueryCallback<NodeList>): void;
    addXpath(xpath: QueryAwaiter["queries"][number]["xpath"], callback: QueryCallback<XPathResult>): void;
    start(): void;
    stop(): void;
}
export {};
