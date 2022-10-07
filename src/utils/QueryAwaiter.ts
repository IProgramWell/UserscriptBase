import * as pageUtils from "./PageUtils";
import { AutoBound } from "./ObjUtils";

type QueryCallback = (elements: Node[]) => void
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
		query: string,
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
		let queryResult: NodeList;
		for (let query of this.queries)
		{
			queryResult = this.pageUtils.queryAllElements(query.query);
			if (queryResult.length > 0)
				query.callback(Array.from(queryResult));
			else
				remainingQueries.push(query);
		}
		this.queries = remainingQueries;
	}

	addQuery(query: string, callback: QueryCallback)
	{
		this.queries.push({ query, callback });
	}

	start()
	{
		this.observerInstance.observe(
			this.target,
			{
				subtree: true,
				childList: true,
			}
		);
	}

	stop()
	{
		this.observerInstance.disconnect();
	}
}