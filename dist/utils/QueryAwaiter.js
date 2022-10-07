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
    constructor(config = QueryAwaiter.DEFAULT_CONSTRUCTOR_PARAMS) {
        super();
        this.queries = [];
        this.target = document.body;
        this.pageUtils = config.pageUtils;
        this.observerInstance = new config.ObserverClass(this.onMutation);
        this.target = config.target;
        this.queries = [];
        if (config.autoStart)
            this.start();
    }
    onMutation( /* mutations: MutationRecord[], observer: MutationObserver */) {
        const remainingQueries = [];
        let queryResult;
        for (let query of this.queries) {
            queryResult = this.pageUtils.queryAllElements(query.query);
            if (queryResult.length > 0)
                query.callback(Array.from(queryResult));
            else
                remainingQueries.push(query);
        }
        this.queries = remainingQueries;
    }
    addQuery(query, callback) {
        this.queries.push({ query, callback });
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
QueryAwaiter.DEFAULT_CONSTRUCTOR_PARAMS = {
    ObserverClass: MutationObserver,
    pageUtils,
    target: document.body,
    autoStart: false,
};
