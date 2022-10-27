/**
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 * 
 * This function replaces all methods in provided object with versions bound to said object.
 */
export function bindMethods<
	T extends Record<PropertyKey, any> = Record<PropertyKey, any>
>(options: {
	source: T;
	assignTo?: T | null;
	bindTo?: T | null;
	pure?: boolean;
}): T
{
	const bindTo = options.bindTo ?? options.source,
		assignTo: Partial<T> = options.pure
			? {}
			: options.assignTo ?? options.source,
		//If `source` is a plain JS object
		sourceProperties: (keyof T)[] = options.source.constructor === Object
			? Object.keys(options.source)
			: Object.getOwnPropertyNames(Object.getPrototypeOf(options.source));

	for (let key of sourceProperties)
		if (key !== "constructor" && typeof options.source[key] === "function")
			assignTo[key] = options.source[key].bind(bindTo);
	return assignTo as T;
}

/**
 * A simple class whose methods are all automatically bound.
 * 
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 */
export class AutoBound { constructor () { bindMethods({ source: this, }); } }