import { arrToObj } from "./ObjUtils";

import type { Component, TagMap, AttributeMap } from "../../types/Component";
import type PageModule from "../modules/PageModule";

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
	return arrToObj(
		url
			.search
			.substring(1)
			.split("&"),
		param => param.substring(0, param.indexOf("=")),
		param => param.substring(param.indexOf("=") + 1)
	);
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

export function elementize<
	TagName extends keyof TagMap = keyof TagMap,
>(component: Component<TagName>): TagMap[TagName]
{
	const [tagName, attributes, ...children] = component;
	const element = createElement(
		tagName,
		attributes ?? {}
	);
	const elementChildren = children?.reduce<(string | Node)[]>(
		(elems, child) =>
		{
			if (child !== null && child !== undefined)
			{
				switch (typeof child)
				{
					case "string":
						elems.push(child);
						break;
					case "object":
						if (Array.isArray(child))
							elems.push(elementize(child));
						else
							elems.push(child);
						break;
					default:
						elems.push(`${child}`);
						break;
				}
			}
			return elems;
		},
		[]
	);

	if (elementChildren && elementChildren.length > 0)
	{
		element.append(...elementChildren);
	}
	return element;
}

export function render(
	parentElement: Element | null,
	components: (Component | Element | Node | string)[],
	insertAt: "start" | "end" = "end",
): void
{
	if (!parentElement || !components || components.length === 0)
		return;
	const elements: (Node | string)[] = [];
	for (let comp of components)
	{
		if (
			comp !== null &&
			comp !== undefined
		)
		{
			if (Array.isArray(comp))
				elements.push(elementize(comp));
			else
				elements.push(comp);
		}
	}
	switch (insertAt)
	{
		case "start":
			parentElement.prepend(...elements);
			break;
		case "end":
		default:
			parentElement.append(...elements);
			break;
	}
}

export function isVisible(element: Element): boolean
{
	let style: CSSStyleDeclaration = globalThis.getComputedStyle(element);
	return (
		style.display !== "none" &&
		style.visibility !== "hidden"
	);
}

export function getIDFor(module: PageModule, ...IDComponents: string[])
{
	const scriptName = globalThis.GM_info?.script?.name,
		{ moduleName } = module;
	return [
		scriptName,
		moduleName
	]
		.concat(...IDComponents)
		.filter(c => c)
		.map(c => Array.from(c.matchAll(/\w+/g)).join(""))
		.join("-");
}