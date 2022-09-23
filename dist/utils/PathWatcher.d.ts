import { AutoBound } from "./ObjUtils";
import IOManager from "./IOManager";
import { getCurrentLocation } from "./URLUtils";
import { onUrlChange } from "../modules/moduleUtils";
import type PageModule from "../modules/PageModule";
export default class PathWatcher extends AutoBound {
    static readonly DEFAULT_WATCHER_OPTIONS: {
        moduleList: PageModule[];
        logger: IOManager;
        watchWholeURL: boolean;
        onUrlChange: typeof onUrlChange;
        ObserverClass: typeof MutationObserver;
        getCurrentLocation: typeof getCurrentLocation;
    };
    readonly observerInstance: MutationObserver;
    readonly logger: IOManager;
    readonly moduleList: PageModule[];
    readonly watchWholeURL: boolean;
    readonly urlChangeHandler: typeof onUrlChange;
    readonly getCurrentLocation: typeof getCurrentLocation;
    lastURL: string;
    constructor(options?: Partial<typeof PathWatcher.DEFAULT_WATCHER_OPTIONS>);
    onUrlChange(): void;
    start(): void;
}
