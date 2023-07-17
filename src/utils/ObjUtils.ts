/**
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 * 
 * This function replaces all methods in provided object with versions bound to said object.
 */
export function bindMethods<
	T extends Record<PropertyKey, any> = Record<PropertyKey, any>,
	B extends Record<PropertyKey, any> = Record<PropertyKey, any>,
>(options: {
	source: T;
	assignTo?: T;
	bindTo?: B;
	pure?: boolean;
	methods?: (keyof T)[];
}): T
{
	const bindTo = options.bindTo ?? options.source,
		assignTo: Partial<T> = options.pure
			? {}
			: options.assignTo ?? options.source,
		sourceProperties: (keyof T)[] = options.methods ??
			//If `source` is a plain JS object
			(options.source.constructor === Object
				? Object.keys(options.source)
				: Object.getOwnPropertyNames(
					Object.getPrototypeOf(options.source)
				)
			);

	for (let key of sourceProperties)
		if (key !== "constructor" && typeof options.source[key] === "function")
			assignTo[key] = options.source[key].bind(bindTo);
		else if (options.pure)
			assignTo[key] = options.source[key];
	return assignTo as T;
}