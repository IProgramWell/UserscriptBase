import * as pageUtils from "./PageUtils";
import { bindMethods } from "./ObjUtils";

import type { AwaitedQuery, } from "types/UtilityTypes";
import type { IPageUtils, } from "types/Interfaces";

export default class QueryAwaiter
{
	static readonly DEFAULY_AWAITER_OPTIONS: {
		ObserverClass: typeof MutationObserver;
		pageUtils: IPageUtils;
		target: Node;
		autoStart: boolean;
	} = {
			ObserverClass: MutationObserver,
			pageUtils,
			target: document.body ?? document,
			autoStart: false,
		};

	observerInstance: MutationObserver;
	pageUtils: IPageUtils;
	queries: AwaitedQuery[] = [];
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

	onMutation(mutations: MutationRecord[]): void
	{
		let matchingNodes: Element[];
		for (let [i, query] of this.queries.entries())
		{
			matchingNodes = mutations
				.flatMap(mutation => Array.from(mutation.addedNodes))
				.filter(node =>
					node instanceof Element &&
					node.matches(query.query)
				) as Element[];

			if (matchingNodes.length > 0)
			{
				query.callback(matchingNodes);
				if (query.removeWhenFound)
					this.queries.splice(i, 1);
			}
		}
	}

	addQuery<R extends Element = Element>(
		query: string,
		callback: AwaitedQuery<R[]>["callback"],
		removeWhenFound: boolean = true
	): void
	{
		if (!query)
			return;
		const currentResult = Array.from(this.pageUtils.queryAllElements<R>(query));
		if (currentResult.length > 0)
		{
			callback(currentResult);
			if (!removeWhenFound)
				this.queries.push({ query, callback, removeWhenFound, });
		}
		else
			this.queries.push({ query, callback, removeWhenFound, });
	}

	start(): void
	{
		this.observerInstance.observe(
			this.target,
			{ subtree: true, childList: true, }
		);
	}

	stop(): void { this.observerInstance.disconnect(); }
}