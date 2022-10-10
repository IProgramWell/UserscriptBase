/**
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 * 
 * This function replaces all methods in provided object with versions bound to said object.
 */
export function bindMethods<
	T extends
	Record<PropertyKey, ((...args: any[]) => any) | any> =
	Record<PropertyKey, ((...args: any[]) => any) | any>
>(
	source: T,
	bindTo: T | null = null,
	assignTo: T | null = null
)
{
	let sourceProperties: (keyof T)[] = [];

	//If `source` is a plain JS object
	if (source.constructor === Object)
		sourceProperties = Object.keys(source);
	else
		sourceProperties = Object.getOwnPropertyNames(
			Object.getPrototypeOf(source)
		);

	for (let key of sourceProperties)
		if (key !== "constructor" && typeof source[key] === "function")
			(assignTo ?? source)[key] = source[key].bind(bindTo ?? source);
}

/**
 * A simple class whose methods are all automatically bound.
 * 
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 */
export class AutoBound { constructor () { bindMethods(this); } }