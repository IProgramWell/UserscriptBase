import type QueryAwaiter from "../utils/QueryAwaiter";
import type { Func } from "types/GeneralTypes";
import type { ILogger, IPageUtils, IURLUtils } from "types/Interfaces";
export declare class PageModule {
    /**
     * A collection of per module event handlers,
     * bound to the current module instance.
     *
     * All event handlers should return a boolean value
     * indicating whether the current module is active or not.
     *
     */
    readonly eventHandlers: {
        init?(): boolean;
        onDocumentLoad?(): boolean;
        onDocumentStart?(): boolean;
        onModuleStart?(): boolean;
        onModuleStop?(): boolean;
    };
    readonly methods: {
        [methodName: PropertyKey]: Func<any, any>;
    };
    readonly shouldBeActive: Func<[url: string | URL | Location | undefined], boolean>;
    readonly moduleName: string | null | undefined;
    readonly logger: ILogger;
    readonly utils: {
        urlUtils: IURLUtils;
        pageUtils: IPageUtils;
        queryAwaiter?: QueryAwaiter;
    };
    state: Map<PropertyKey, any>;
    isActive: boolean;
    constructor(moduleDetails: {
        eventHandlers?: PageModule["eventHandlers"];
        methods?: PageModule["methods"];
        utils?: PageModule["utils"];
        shouldBeActive?: PageModule["shouldBeActive"];
        moduleName?: string;
        logger?: ILogger;
    });
    getStateValue<T, R = T | null>(name: PropertyKey, defaultValue?: R): R;
    setStateValue<T>(name: PropertyKey, value: T): void;
}
export default PageModule;
