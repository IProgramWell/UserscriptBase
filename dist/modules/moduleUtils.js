"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateForRegex = exports.onUrlChange = exports.callAllModulesMethod = exports.onModuleEvent = void 0;
function onModuleEvent(options) {
    var _a, _b;
    let wasModuleActive, newIsActive;
    for (let module of options.moduleList) {
        try {
            if (module.isActive !== module.shouldBeActive(module.utils.urlUtils.getCurrentLocation())) {
                wasModuleActive = module.isActive;
                newIsActive = (_b = (_a = module.eventHandlers)[options.eventHandlerName]) === null || _b === void 0 ? void 0 : _b.call(_a, ...options.handlerArgs);
                /* newIsActive = module.eventHandlers[
                    options.eventHandlerName
                ]?.(
                    ...options.handlerArgs
                ); */
                if (typeof newIsActive === "boolean" &&
                    newIsActive !== wasModuleActive) {
                    module.isActive = newIsActive;
                    options.logger.print((newIsActive
                        ? "Started"
                        : "Stopped") +
                        ` module: "${module.moduleName}"`);
                }
            }
        }
        catch (err) {
            options.logger.error(err, module);
        }
    }
}
exports.onModuleEvent = onModuleEvent;
;
function callAllModulesMethod(options) {
    var _a, _b;
    for (let module of options.moduleList) {
        try {
            if (!options.onlyIfShouldBeActive ||
                module.shouldBeActive(module.utils.urlUtils.getCurrentLocation()))
                (_b = (_a = module.methods) === null || _a === void 0 ? void 0 : _a[options.methodName]) === null || _b === void 0 ? void 0 : _b.call(_a, ...options.methodArgs);
        }
        catch (err) {
            options.logger.error({
                err,
                module,
                methodName: options.methodName,
                methodArgs: options.methodArgs,
            });
        }
    }
}
exports.callAllModulesMethod = callAllModulesMethod;
function onUrlChange(options) {
    var _a, _b;
    for (let module of options.moduleList) {
        try {
            if (module.shouldBeActive(options.currentLocation)) {
                if (!module.isActive && module.eventHandlers.onModuleStart) {
                    module.isActive = module.eventHandlers.onModuleStart();
                    (_a = options.logger) === null || _a === void 0 ? void 0 : _a.print(`Started module: "${module.moduleName}"`);
                }
            }
            else if (module.isActive && module.eventHandlers.onModuleStop) {
                module.isActive = module.eventHandlers.onModuleStop();
                (_b = options.logger) === null || _b === void 0 ? void 0 : _b.print(`Stopped module: "${module.moduleName}"`);
            }
        }
        catch (err) {
            options.logger.error(err, module);
        }
    }
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
