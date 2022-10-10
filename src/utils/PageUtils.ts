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
	...args: Parameters<typeof document.evaluate>
): ReturnType<typeof document.evaluate>
{
	return document.evaluate(...args);
}

export function getSearchParams(url: URL | Location = document.location): { [searchParam: string]: string }
{
	const params: Record<string, string> = {};
	let key: string, value: string;
	for (let param of url
		.search
		.substring(1)
		.split("&")
	)
	{
		[key, value] = param.split("=");
		params[key] = value;
	}
	return params;
}

export function removeElementById(id: string | null)
{
	if (!id)
		return;

	document.getElementById(id)?.remove?.();
};

export function createElement<
	T extends keyof TagMap = keyof TagMap,
>(
	type: T,
	attributes: Partial<AttributeMap<T>> = {}
): TagMap[T]
{
	return Object.assign(
		document.createElement(type),
		attributes
	);
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