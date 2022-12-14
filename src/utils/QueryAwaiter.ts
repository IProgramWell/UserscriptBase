import * as pageUtils from "./PageUtils";
import { bindMethods } from "./ObjUtils";

import type { XPathQuery, QueryCallback } from "types/UtilityTypes";
import type { IPageUtils } from "types/Interfaces";

export default class QueryAwaiter
{
	static readonly DEFAULY_AWAITER_OPTIONS: {
		ObserverClass: typeof MutationObserver;
		pageUtils: IPageUtils;
		target: QueryAwaiter["target"];
		autoStart: boolean;
	} = {
			ObserverClass: MutationObserver,
			pageUtils,
			target: document.body ?? document,
			autoStart: false,
		};

	observerInstance: MutationObserver;
	pageUtils: IPageUtils;
	queries: {
		query?: string;
		xpath?: XPathQuery,
		callback: QueryCallback
	}[] = [];
	target: Node = document.body ?? document;
	constructor (
		options:
			Partial<typeof QueryAwaiter.DEFAULY_AWAITER_OPTIONS> =
			QueryAwaiter.DEFAULY_AWAITER_OPTIONS
	)
	{
		const fullOptions = {
			...QueryAwaiter.DEFAULY_AWAITER_OPTIONS,
			...options,
		};

		bindMethods({ source: this });

		this.pageUtils = fullOptions.pageUtils;
		this.observerInstance = new fullOptions.ObserverClass(this.onMutation);
		this.target = fullOptions.target;
		this.queries = [];
		if (fullOptions.autoStart)
			this.start();
	}

	onMutation(/* mutations: MutationRecord[], observer: MutationObserver */): void
	{
		const remainingQueries: QueryAwaiter["queries"] = [];
		let queryResult: NodeList | XPathResult | null;
		for (let query of this.queries)
		{
			if (query.query)
				queryResult = this.pageUtils.queryAllElements(query.query);
			else if (query.xpath)
			{
				queryResult = this.pageUtils.evaluate(
					query.xpath.xpath,
					query.xpath.contextNode ?? document.body,
					query.xpath.namespaceResolver ?? null,
					query.xpath.resultType ?? XPathResult.ANY_TYPE,
					query.xpath.result ?? null
				);
			}
			else
				queryResult = null;
			if (
				(queryResult instanceof NodeList && queryResult.length > 0) ||
				(queryResult instanceof XPathResult && query.xpath.isValidResult?.(queryResult))
			)
				query.callback(queryResult);
			else
				remainingQueries.push(query);
		}
		this.queries = remainingQueries;
	}

	addQuery(query: string, callback: QueryCallback<NodeList>): void
	{
		if (!query)
			return;
		const currentResult = this.pageUtils.queryAllElements(query);
		if (currentResult.length > 0)
			return callback(currentResult);
		this.queries.push({ query, callback });
	}
	addXpath(xpath: XPathQuery, callback: QueryCallback<XPathResult>): void
	{
		if (!xpath?.xpath)
			return;
		const currentResult = this.pageUtils.evaluate(
			xpath.xpath,
			xpath.contextNode ?? document.body ?? document,
			xpath.namespaceResolver ?? null,
			xpath.resultType ?? XPathResult.ANY_TYPE,
			xpath.result ?? null
		);
		if (xpath.isValidResult?.(currentResult))
			return callback(currentResult);
		this.queries.push({ xpath, callback });
	}

	start(): void
	{
		this.observerInstance.observe(
			this.target,
			{ subtree: true, childList: true, }
		);
	}

	stop(): void
	{
		this.observerInstance.disconnect();
	}
}