"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const ObjUtils_1 = require("./ObjUtils");
const PageUtils_1 = require("./PageUtils");
const { script: { name: scriptName, version: scriptVersion } } = (_a = globalThis.GM_info) !== null && _a !== void 0 ? _a : { script: {} };
class IOManager extends ObjUtils_1.AutoBound {
    constructor(loggerOptions = IOManager.DEFAULT_LOGGER_OPTIONS) {
        var _a, _b;
        const options = Object.assign(Object.assign({}, IOManager.DEFAULT_LOGGER_OPTIONS), loggerOptions);
        super();
        this.isInIFrame = false;
        this.scriptName = options.name;
        this.logTimestamp = options.logTimestamp;
        this.timestampFormat = options.timestampFormat;
        this.isInIFrame = (_b = (_a = options.detectIFrames) === null || _a === void 0 ? void 0 : _a.call(options)) !== null && _b !== void 0 ? _b : false;
    }
    getTimestamp() {
        switch (this.timestampFormat) {
            case "UTC":
                return new Date().toUTCString();
            case "ISO":
                return new Date().toISOString();
            case "Locale":
                return new Date().toLocaleString();
            case "Milliseconds":
                return new Date().getTime().toString();
            case "Human":
            default:
                return new Date().toString();
        }
    }
    joinPrefixes(prefixList, addSpace = false) {
        const formattedList = [];
        for (let prfx of prefixList)
            if (prfx)
                formattedList.push(`[${prfx}]`);
        const prefix = `${formattedList.join(" ")}:`;
        return (addSpace ? prefix + " " : prefix);
    }
    getPrefix(includeTimestamp = false, addSpace = false) {
        const prefixList = [];
        if (includeTimestamp)
            prefixList.push(this.getTimestamp());
        if (this.isInIFrame)
            prefixList.push(IOManager.IFRAME_LOG_PREFIX);
        prefixList.push(this.scriptName);
        return this.joinPrefixes(prefixList, addSpace);
    }
    print(...messages) {
        console.log(this.getPrefix(this.logTimestamp, false), ...messages);
    }
    error(...errors) {
        console.error(this.getPrefix(this.logTimestamp, false), ...errors);
    }
    prompt(message, defaultText, includeTimestamp = false) {
        return globalThis.prompt(this.getPrefix(includeTimestamp, true) +
            message, defaultText);
    }
    alert(message, includeTimestamp = false) {
        globalThis.alert(this.getPrefix(includeTimestamp, true) +
            message);
    }
}
exports.default = IOManager;
IOManager.IFRAME_LOG_PREFIX = "iframe";
IOManager.DEFAULT_LOGGER_OPTIONS = {
    name: globalThis.GM_info
        ? `${scriptName} v${scriptVersion}`
        : "",
    logTimestamp: true,
    timestampFormat: "Locale",
    detectIFrames: PageUtils_1.isScriptInIFrame
};
IOManager.GLOBAL_MANAGER = new IOManager();
