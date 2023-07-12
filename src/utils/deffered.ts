export default class Deffered<T, E> extends Promise<T>
{
	resolve: { (value: T): void | PromiseLike<void>; };
	reject: { (reason: E): void | PromiseLike<void>; };

	constructor ()
	{
		super((resolve, reject) =>
		{
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}