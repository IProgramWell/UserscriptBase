import Replacement from "./Replacement";

export default class Recorder<
	T,
	C extends {} = {},
	K extends keyof C = keyof C
> extends Replacement<C, K>
{
	private readonly items: T[] = [];

	constructor (
		container: C,
		key: K,
		interceptorOptions: C[K] extends {} ? ProxyHandler<C[K]> : never
	)
	{
		super(
			container,
			key,
			new Proxy(container[key], interceptorOptions)
		);
	}

	add(this: Recorder<T, C, K>, item: T): void { this.items.push(item); }

	remove(this: Recorder<T, C, K>, index: number): T | undefined { return this.items.splice(index, 1)[0]; }

	clear(this: Recorder<T, C, K>): T[] { return this.items.splice(0, this.items.length); }

	item(this: Recorder<T, C, K>, index: number): T | undefined { return this.items[index]; }

	getItems(this: Recorder<T, C, K>): T[] { return this.items; }

	isEmpty(this: Recorder<T, C, K>): boolean { return this.items.length === 0; }

	hasItems(this: Recorder<T, C, K>): boolean { return this.items.length > 0; }

	*[Symbol.iterator]()
	{
		for (let i = 0; i <= this.items.length; i++)
			yield this.items[i];
	}
}