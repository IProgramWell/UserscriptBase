import type { AttributeMap, TagMap } from "./ElementTypes";

export interface ILogger
{
	print(...messages: (string | any)[]): void;
	error(...errors: (string | any)[]): void;
	prompt(
		message: string,
		defaultText: string
	): string | null;
	alert(message: string): void;
}

export interface IComparable<T>
{
	compareTo(this: IComparable<T>, other: IComparable<T>): number;
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
	getSearchParams(url?: URL | Location): { [searchParam: string]: string };
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