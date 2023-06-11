import type { AttributeMap, TagMap } from "./ElementTypes";

export interface ILogger
{
	print(...messages: (string | any)[]): void;
	error(...errors: (string | any)[]): void;
}

export interface IPageUtils
{
	queryElement<R extends Element = Element>(query: string): R | null;
	queryAllElements<R extends Element = Element>(query: string): NodeListOf<R>;
	evaluate(
		expression: string,
		contextNode: Node,
		resolver?: XPathNSResolver,
		type?: number,
		result?: XPathResult
	): XPathResult;
	getSearchParams(url?: URL | Location): Map<string, string>
	removeElementById(id: string | null): void;
	createElement<T extends keyof TagMap = keyof TagMap>(
		type: T,
		attributes?: Partial<AttributeMap<T>>,
		children?: (Node | string)[]
	): TagMap[T];
	isVisible(element: Element): boolean;
	isScriptInIFrame(): boolean;
}
export interface IURLUtils
{
	navigate(NewURL: string | URL | Location): void;
	setLocationAttribute(
		AttrName: "hash" |
			"host" |
			"hostname" |
			"href" |
			"pathname" |
			"port" |
			"protocol" |
			"search",
		AttrValue: string
	): void;
	openNewTab(URL: string | URL | Location): void;
	getCurrentLocation(): URL | Location;
}

export interface IRequestUtils
{
	getHeaders(reqeust: XMLHttpRequest): Map<string, string | string[]>;
	extractFromRequest(request: XMLHttpRequest):
	{
		response: {
			body: string | object;
			headers: Map<string, string | string[]>;
			status: number;
		};
		url: string;
	};
}