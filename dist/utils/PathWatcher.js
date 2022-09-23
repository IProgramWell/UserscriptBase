"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObjUtils_1 = require("./ObjUtils");
const IOManager_1 = __importDefault(require("./IOManager"));
const URLUtils_1 = require("./URLUtils");
const moduleUtils_1 = require("../modules/moduleUtils");
const DEFAULT_CTOR_OPTIONS = {
    moduleList: [],
    logger: IOManager_1.default.GLOBAL_MANAGER,
    watchWholeURL: false,
    onUrlChange: moduleUtils_1.onUrlChange,
    ObserverClass: MutationObserver,
    getCurrentLocation: URLUtils_1.getCurrentLocation,
};
class PathWatcher extends ObjUtils_1.AutoBound {
    constructor(options = DEFAULT_CTOR_OPTIONS) {
        super();
        this.watchWholeURL = false;
        let fullOptions = Object.assign(Object.assign({}, DEFAULT_CTOR_OPTIONS), options);
        this.lastURL = "";
        this.observerInstance = new fullOptions.ObserverClass(this.onUrlChange);
        this.logger = fullOptions.logger;
        this.moduleList = fullOptions.moduleList;
        this.watchWholeURL = fullOptions.watchWholeURL;
        this.urlChangeHandler = fullOptions.onUrlChange.bind(this);
        this.getCurrentLocation = fullOptions.getCurrentLocation.bind(this);
    }
    onUrlChange() {
        let location = this.getCurrentLocation(), url = this.watchWholeURL
            ? location.href
            : location.pathname;
        if (this.lastURL === url)
            return;
        this.lastURL = url;
        this.logger.print("Changed url!", `New ${this.watchWholeURL ? "url" : "pathname"}: "${url}"`);
        this.urlChangeHandler({
            moduleList: this.moduleList,
            currentLocation: this.getCurrentLocation(),
            logger: this.logger,
        });
    }
    start() {
        this.observerInstance.observe(document, {
            subtree: true,
            childList: true,
            attributeFilter: ["location"]
        });
    }
}
exports.default = PathWatcher;
;
