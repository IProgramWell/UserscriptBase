import * as pageUtils from "./PageUtils";
import { AutoBound } from "./ObjUtils";

type QueryCallback<
	R extends NodeList | XPathResult =
	NodeList | XPathResult
> = (elements: R) => void;
export default class QueryAwaiter extends AutoBound
{
	static readonly DEFAULY_AWAITER_OPTIONS: {
		ObserverClass: typeof MutationObserver,
		pageUtils: typeof pageUtils,
		target: QueryAwaiter["target"],
		autoStart: boolean,
	} = {
			ObserverClass: MutationObserver,
			pageUtils,
			target: document.body,
			autoStart: false,
		};

	observerInstance: MutationObserver;
	pageUtils: typeof pageUtils;
	queries: {
		query?: string;
		xpath?: {
			xpath: string;
			contextNode?: Node;
			namespaceResolver?: XPathNSResolver;
			resultType?: number;
			result?: XPathResult;
			isValidResult?(result: XPathResult): boolean;
		},
		callback: QueryCallback
	}[] = [];
	target: Node = document.body;
	constructor (
		options:
			Partial<typeof QueryAwaiter.DEFAULY_AWAITER_OPTIONS> =
			QueryAwaiter.DEFAULY_AWAITER_OPTIONS
	)
	{
		let fullOptions = {
			...QueryAwaiter.DEFAULY_AWAITER_OPTIONS,
			...options,
		};

		super();

		this.pageUtils = fullOptions.pageUtils;
		this.observerInstance = new fullOptions.ObserverClass(this.onMutation);
		this.target = fullOptions.target;
		this.queries = [];
		if (fullOptions.autoStart)
			this.start();
	}

	onMutation(/* mutations: MutationRecord[], observer: MutationObserver */)
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
	addXpath(
		xpath: QueryAwaiter["queries"][number]["xpath"],
		callback: QueryCallback<XPathResult>
	): void
	{
		if (!xpath)
			return;
		const currentResult = this.pageUtils.evaluate(
			xpath.xpath,
			xpath.contextNode ?? document.body,
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

	stop()
	{
		this.observerInstance.disconnect();
	}
}