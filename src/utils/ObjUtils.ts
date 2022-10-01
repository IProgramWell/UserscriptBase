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

	if (!bindTo)
		bindTo = source;
	if (!assignTo)
		assignTo = source;

	for (let key of sourceProperties)
		if (key !== "constructor" && typeof source[key] === "function")
			assignTo[key] = source[key].bind(bindTo);
}

/**
 * A simple class whose methods are all automatically bound.
 * 
 * I want intelisense to recognise the methods as, well, methods,
 * but I also want auto-bound functions.
 */
export class AutoBound
{
	[key: string]: ((...args: any[]) => any) | any;

	constructor ()
	{
		let properties = Object.getOwnPropertyNames(
			Object.getPrototypeOf(this)
		);

		for (let key of properties)
			if (key !== "constructor" && typeof this[key] === "function")
				this[key] = this[key].bind(this);
	}
}

export function arrToObj<T, R = T>(
	arr: T[],
	getKey: (
		element: T,
		index: number,
		array: T[]
	) => string = (_, index) => index.toString(),
	getValue: (
		element: T,
		index: number,
		array: T[]
	) => (R | T) = elem => elem
): Record<string, (R | T)>
{
	const result: ReturnType<typeof arrToObj<T, R>> = {};
	for (let i = 0; i < arr.length; i++)
		result[getKey(arr[i], i, arr)] = getValue(arr[i], i, arr);
	return result;
};