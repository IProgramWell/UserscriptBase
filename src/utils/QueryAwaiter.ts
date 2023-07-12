import * as pageUtils from "./PageUtils";
import { bindMethods } from "./ObjUtils";

import type {
	QueryCallback,
	CSSQueryResult,
} from "types/UtilityTypes";
import type { IPageUtils } from "types/Interfaces";

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
	queries: {
		callback: QueryCallback;
		query: string;
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

	onMutation(mutations: MutationRecord[]): void
	{
		let matchingNodes: Element[];
		for (let [i, query] of this.queries.entries())
		{
			matchingNodes = [];
			if (typeof query.query === "string")
				for (let mutation of mutations)
					for (let node of Array.from(mutation.addedNodes))
						if (
							node instanceof Element &&
							node.matches(query.query)
						)
							matchingNodes.push(node);
			if (matchingNodes.length > 0)
				query.callback(matchingNodes);
			this.queries.splice(i, 1);
		}
	}

	addQuery(query: string, callback: QueryCallback<CSSQueryResult>): void
	{
		if (!query)
			return;
		const currentResult = Array.from(this.pageUtils.queryAllElements(query));
		if (currentResult.length > 0)
			return callback(currentResult);
		this.queries.push({ query, callback });
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