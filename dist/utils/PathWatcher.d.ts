import { AutoBound } from "./ObjUtils";
import { getCurrentLocation } from "./URLUtils";
import { onUrlChange } from "../modules/moduleUtils";
import type PageModule from "../modules/PageModule";
import type { ILogger } from "../../types/Interfaces";
export default class PathWatcher extends AutoBound {
    static readonly DEFAULT_WATCHER_OPTIONS: {
        moduleList: PageModule[];
        logger?: ILogger;
        watchWholeURL: boolean;
        onUrlChange: typeof onUrlChange;
        ObserverClass: typeof MutationObserver;
        getCurrentLocation: typeof getCurrentLocation;
    };
    readonly observerInstance: MutationObserver;
    readonly logger: ILogger;
    readonly moduleList: PageModule[];
    readonly watchWholeURL: boolean;
    readonly urlChangeHandler: typeof onUrlChange;
    readonly getCurrentLocation: typeof getCurrentLocation;
    lastURL: string;
    constructor(options?: Partial<typeof PathWatcher.DEFAULT_WATCHER_OPTIONS>);
    onUrlChange(): void;
    start(): void;
}
