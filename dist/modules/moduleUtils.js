"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateForRegex = exports.onUrlChange = exports.callAllModulesMethod = exports.onModuleEvent = void 0;
const IOManager_1 = __importDefault(require("../utils/IOManager"));
function onModuleEvent(options) {
    var _a, _b, _c, _d, _e;
    let newIsActive, numOfCalls = 0;
    ;
    for (let module of options.moduleList) {
        try {
            if (!options.onlyIfShouldBeActive ||
                module.isActive !== module.shouldBeActive((_a = options.currentLocation) !== null && _a !== void 0 ? _a : module.utils.urlUtils.getCurrentLocation())) {
                newIsActive = (_c = (_b = module.eventHandlers)[options.eventHandlerName]) === null || _c === void 0 ? void 0 : _c.call(_b, ...(options.handlerArgs));
                if (typeof newIsActive === "boolean" &&
                    newIsActive !== module.isActive) {
                    module.isActive = newIsActive;
                    numOfCalls++;
                    ((_d = options.logger) !== null && _d !== void 0 ? _d : IOManager_1.default.GLOBAL_MANAGER).print((newIsActive
                        ? "Started"
                        : "Stopped") +
                        ` module: "${module.moduleName}"`);
                }
            }
        }
        catch (err) {
            ((_e = options.logger) !== null && _e !== void 0 ? _e : IOManager_1.default.GLOBAL_MANAGER).error(err, module);
        }
    }
    return numOfCalls;
}
exports.onModuleEvent = onModuleEvent;
;
function callAllModulesMethod(options) {
    var _a, _b, _c, _d;
    let numOfCalls = 0;
    for (let module of options.moduleList) {
        try {
            if (!options.onlyIfShouldBeActive ||
                module.shouldBeActive((_a = options.currentLocation) !== null && _a !== void 0 ? _a : module.utils.urlUtils.getCurrentLocation())) {
                numOfCalls++;
                (_c = (_b = module.methods) === null || _b === void 0 ? void 0 : _b[options.methodName]) === null || _c === void 0 ? void 0 : _c.call(_b, ...options.methodArgs);
            }
        }
        catch (err) {
            ((_d = options.logger) !== null && _d !== void 0 ? _d : IOManager_1.default.GLOBAL_MANAGER).error({
                err,
                module,
                methodName: options.methodName,
                methodArgs: options.methodArgs,
            });
        }
    }
    return numOfCalls;
}
exports.callAllModulesMethod = callAllModulesMethod;
function onUrlChange(options) {
    var _a, _b, _c, _d;
    let numOfCalls = 0;
    for (let module of options.moduleList) {
        try {
            if (module.shouldBeActive((_a = options.currentLocation) !== null && _a !== void 0 ? _a : module.utils.urlUtils.getCurrentLocation())) {
                if (!module.isActive && module.eventHandlers.onModuleStart) {
                    numOfCalls++;
                    module.isActive = module.eventHandlers.onModuleStart();
                    (_b = options.logger) === null || _b === void 0 ? void 0 : _b.print(`Started module: "${module.moduleName}"`);
                }
            }
            else if (module.isActive && module.eventHandlers.onModuleStop) {
                numOfCalls++;
                module.isActive = module.eventHandlers.onModuleStop();
                (_c = options.logger) === null || _c === void 0 ? void 0 : _c.print(`Stopped module: "${module.moduleName}"`);
            }
        }
        catch (err) {
            ((_d = options.logger) !== null && _d !== void 0 ? _d : IOManager_1.default.GLOBAL_MANAGER).error(err, module);
        }
    }
    return numOfCalls;
}
exports.onUrlChange = onUrlChange;
function activateForRegex(regex, wholeUrl = false) {
    const ACTIVATE_REGEXP = typeof regex === "string"
        ? new RegExp(regex)
        : regex;
    return function (url) {
        const TEST_URL = url
            ? (typeof url === "string"
                ? new URL(url)
                : url)
            : this.utils.urlUtils.getCurrentLocation();
        return ACTIVATE_REGEXP.test(wholeUrl
            ? TEST_URL.href
            : TEST_URL.pathname);
    };
}
exports.activateForRegex = activateForRegex;
