import * as pageUtils from "./PageUtils";
import { AutoBound } from "./ObjUtils";
declare type QueryCallback = (elements: Node[]) => void;
export default class QueryAwaiter extends AutoBound {
    static readonly DEFAULT_CONSTRUCTOR_PARAMS: {
        ObserverClass: typeof MutationObserver;
        pageUtils: typeof pageUtils;
    };
    observerInstance: MutationObserver;
    pageUtils: typeof pageUtils;
    queries: {
        query: string;
        callback: QueryCallback;
    }[];
    constructor(config?: typeof QueryAwaiter.DEFAULT_CONSTRUCTOR_PARAMS);
    onMutation(): void;
    addQuery(query: string, callback: QueryCallback): void;
}
export {};
