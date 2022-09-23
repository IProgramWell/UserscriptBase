import * as utils from "../utils";
import type { ModuleTypes } from "../../types";
export declare class PageModule extends utils.ObjUtils.AutoBound {
    /**
     * A collection of per module event handlers,
     * bound to the current module instance.
     *
     * All event handlers should return a boolean value
     * indicating whether the current module is active or not.
     *
     */
    readonly eventHandlers: {
        init?: ModuleTypes.ModuleEventHandler<[], boolean>;
        onDocumentLoad?: ModuleTypes.ModuleEventHandler<[], boolean>;
        /**
         * Technically useless because `onModuleStart`
         * runs when the document is started, too.
         */
        onDocumentStart?: ModuleTypes.ModuleEventHandler<[], boolean>;
        onModuleStart?: ModuleTypes.ModuleEventHandler<[], boolean>;
        onModuleStop?: ModuleTypes.ModuleEventHandler<[], boolean>;
    };
    readonly methods: {
        [methodName: PropertyKey]: (...args: any) => any;
    };
    readonly shouldBeActive: (url?: string | URL | Location) => boolean;
    readonly moduleName: string | null | undefined;
    readonly logger: utils.IOManager;
    readonly utils: {
        urlUtils: typeof utils.URLUtils;
        pageUtils: typeof utils.PageUtils;
    };
    state: Record<PropertyKey, any>;
    isActive: boolean;
    constructor(moduleDetails: {
        eventHandlers?: PageModule["eventHandlers"];
        methods?: PageModule["methods"];
        utils?: PageModule["utils"];
        shouldBeActive?: PageModule["shouldBeActive"];
        moduleName?: string;
        logger?: utils.IOManager;
    });
    getStateValue<T>(name: keyof PageModule["state"], defaultValue?: T | null): T | null | undefined;
    setStateValue<T>(name: keyof PageModule["state"], value: T): void;
}
export default PageModule;
