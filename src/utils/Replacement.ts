import { bindMethods } from "./ObjUtils";
import DetailedEvent from "./DetailedEvent";

/**
 * Replacement events:
 * 	- "beforeInstall",
 * 	- "installed"
 * 	- "beforeUninstall"
 * 	- "uninstalled"
 * 
 * Note that events aren't fired if nothing will change ("beforeInstall" and "installed" events
 * won't fire if the `Replacement` was already installed, and vice versa).
 */
export default class Replacement<C extends object = object, K extends keyof C = keyof C> extends EventTarget
{
	private readonly original: C[K];
	private readonly replacement: C[K];
	private readonly key: K;
	private readonly container: C;

	get isInstalled() { return this.container[this.key] === this.replacement; }

	constructor (container: C, key: K, replacement: C[K])
	{
		super();

		bindMethods({ source: this, });

		this.container = container;
		this.key = key;
		this.replacement = replacement;
		this.original = container[key];
	}

	/** @returns Returns whether or not installing was successful. */
	install(this: Replacement<C, K>): boolean
	{
		if (this.isInstalled)
			return true;
		try
		{
			this.dispatchEvent(new DetailedEvent(
				"beforeInstall",
				this.container[this.key]
			));
			this.container[this.key] = this.replacement;
			this.dispatchEvent(new DetailedEvent(
				"installed",
				this.container[this.key]
			));
			return true;
		}
		catch (_)
		{
			return false;
		}
	}
	/** @returns Returns whether or not uninstalling was successful. */
	uninstall(this: Replacement<C, K>): boolean
	{
		if (!this.isInstalled)
			return true;
		try
		{
			this.dispatchEvent(new DetailedEvent(
				"beforeUninstall",
				this.container[this.key]
			));
			this.container[this.key] = this.original;
			this.dispatchEvent(new DetailedEvent(
				"uninstalled",
				this.container[this.key]
			));
			return true;
		}
		catch (_)
		{
			return false;
		}
	}
}