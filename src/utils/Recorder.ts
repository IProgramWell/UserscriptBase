import Replacement from "./Replacement";
import DetailedEvent from "./DetailedEvent";

/**
 * Recorder-specific events:
 * 
 * 	- "added"
 * 	- "removed"
 * 	- "cleared"
 */
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

	add(this: Recorder<T, C, K>, item: T): void
	{
		this.items.push(item);
		this.dispatchEvent(new DetailedEvent("added", item));
	}

	remove(this: Recorder<T, C, K>, index: number): T | undefined
	{
		let removed = this.items.splice(index, 1)[0];
		this.dispatchEvent(new DetailedEvent("removed", removed));
		return removed;
	}

	clear(this: Recorder<T, C, K>): T[]
	{
		let removed = this.items.splice(0, this.items.length);
		this.dispatchEvent(new DetailedEvent("cleared", removed));
		return removed;
	}

	item(this: Recorder<T, C, K>, index: number): T | undefined { return this.items[index]; }

	getItems(this: Recorder<T, C, K>): T[] { return this.items; }

	isEmpty(this: Recorder<T, C, K>): boolean { return this.items.length === 0; }

	hasItems(this: Recorder<T, C, K>): boolean { return this.items.length > 0; }

	*[Symbol.iterator]()
	{
		for (let i = 0; i < this.items.length; i++)
			yield this.items[i];
	}
}