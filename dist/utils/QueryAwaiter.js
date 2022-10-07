"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pageUtils = __importStar(require("./PageUtils"));
const ObjUtils_1 = require("./ObjUtils");
class QueryAwaiter extends ObjUtils_1.AutoBound {
    constructor(options = QueryAwaiter.DEFAULY_AWAITER_OPTIONS) {
        let fullOptions = Object.assign(Object.assign({}, QueryAwaiter.DEFAULY_AWAITER_OPTIONS), options);
        super();
        this.queries = [];
        this.target = document.body;
        this.pageUtils = fullOptions.pageUtils;
        this.observerInstance = new fullOptions.ObserverClass(this.onMutation);
        this.target = fullOptions.target;
        this.queries = [];
        if (fullOptions.autoStart)
            this.start();
    }
    onMutation( /* mutations: MutationRecord[], observer: MutationObserver */) {
        var _a, _b, _c, _d;
        const remainingQueries = [];
        let queryResult;
        for (let query of this.queries) {
            if (query.query)
                queryResult = this.pageUtils.queryAllElements(query.query);
            else if (query.xpath) {
                queryResult = this.pageUtils.evaluate(query.xpath.xpath, (_a = query.xpath.contextNode) !== null && _a !== void 0 ? _a : document.body, (_b = query.xpath.namespaceResolver) !== null && _b !== void 0 ? _b : null, (_c = query.xpath.resultType) !== null && _c !== void 0 ? _c : XPathResult.ANY_TYPE, (_d = query.xpath.result) !== null && _d !== void 0 ? _d : null);
            }
            else
                queryResult = null;
            if ((queryResult instanceof NodeList && queryResult.length > 0) ||
                (queryResult instanceof XPathResult))
                query.callback(queryResult);
            else
                remainingQueries.push(query);
        }
        this.queries = remainingQueries;
    }
    addQuery(query, callback) {
        if (!query)
            return;
        const currentResult = this.pageUtils.queryAllElements(query);
        if (currentResult.length > 0)
            return callback(currentResult);
        this.queries.push({ query, callback });
    }
    addXpath(xpath, callback) {
        var _a, _b, _c, _d, _e;
        if (!xpath)
            return;
        const currentResult = this.pageUtils.evaluate(xpath.xpath, (_a = xpath.contextNode) !== null && _a !== void 0 ? _a : document.body, (_b = xpath.namespaceResolver) !== null && _b !== void 0 ? _b : null, (_c = xpath.resultType) !== null && _c !== void 0 ? _c : XPathResult.ANY_TYPE, (_d = xpath.result) !== null && _d !== void 0 ? _d : null);
        if ((_e = xpath.isValidResult) === null || _e === void 0 ? void 0 : _e.call(xpath, currentResult))
            return callback(currentResult);
        this.queries.push({ xpath, callback });
    }
    start() {
        this.observerInstance.observe(this.target, {
            subtree: true,
            childList: true,
        });
    }
    stop() {
        this.observerInstance.disconnect();
    }
}
exports.default = QueryAwaiter;
QueryAwaiter.DEFAULY_AWAITER_OPTIONS = {
    ObserverClass: MutationObserver,
    pageUtils,
    target: document.body,
    autoStart: false,
};
