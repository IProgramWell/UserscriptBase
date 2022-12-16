import * as URLUtils from "../utils/URLUtils";
import * as PageUtils from "../utils/PageUtils";
import type QueryAwaiter from "../utils/QueryAwaiter";
import type { Interfaces } from "../../types";
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
        [methodName: PropertyKey]: (...args: any) => any;
    };
    readonly shouldBeActive: (url?: string | URL | Location) => boolean;
    readonly moduleName: string | null | undefined;
    readonly logger: Interfaces.ILogger;
    readonly utils: {
        urlUtils: typeof URLUtils;
        pageUtils: typeof PageUtils;
        queryAwaiter?: QueryAwaiter;
    };
    state: Record<PropertyKey, any>;
    isActive: boolean;
    constructor(moduleDetails: {
        eventHandlers?: PageModule["eventHandlers"];
        methods?: PageModule["methods"];
        utils?: PageModule["utils"];
        shouldBeActive?: PageModule["shouldBeActive"];
        moduleName?: string;
        logger?: Interfaces.ILogger;
    });
    getStateValue<T>(name: keyof PageModule["state"], defaultValue?: T | null): T | null | undefined;
    setStateValue<T>(name: keyof PageModule["state"], value: T): void;
}
export default PageModule;
