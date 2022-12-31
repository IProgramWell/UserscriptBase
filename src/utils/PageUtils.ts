import type { TagMap, AttributeMap } from "../../types/ElementTypes";

export function queryElement<R extends Element = Element>(query: string): R | null
{
	return document.querySelector<R>(query);
}

export function queryAllElements<R extends Element = Element>(query: string): NodeListOf<R>
{
	return document.querySelectorAll<R>(query);
}

export function evaluate(
	expression: string,
	contextNode: Node,
	resolver?: XPathNSResolver,
	type?: number,
	result?: XPathResult
): XPathResult
{
	return document.evaluate(expression, contextNode, resolver, type, result);
}

export function getSearchParams(url: URL | Location = document.location): { [searchParam: string]: string }
{
	const params: Record<string, string> = {};

	let eqIndex: number;
	for (
		let param
		of (url.search.startsWith("?")
			? url.search.substring(1)
			: url.search
		).split("&")
	)
	{
		eqIndex = param.indexOf("=");
		params[param.substring(0, eqIndex)] = param.substring(eqIndex + 1);
	}
	return params;
}

export function removeElementById(id: string | null): void
{
	if (!id)
		return;

	document.getElementById(id)?.remove?.();
};

export function createElement<
	T extends keyof TagMap = keyof TagMap,
>(
	type: T,
	attributes: Partial<AttributeMap<T>> = {},
	children?: (Node | string)[]
): TagMap[T]
{
	const element = Object.assign(
		document.createElement(type),
		attributes
	);
	if (children)
		element.append(...children);
	return element;
}

export function isVisible(element: Element): boolean
{
	let style: CSSStyleDeclaration = globalThis.getComputedStyle(element);
	return (
		style.display !== "none" &&
		style.visibility !== "hidden"
	);
}

export function isScriptInIFrame(): boolean { return globalThis.self !== globalThis.top }