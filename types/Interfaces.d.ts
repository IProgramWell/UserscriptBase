export interface ILogger
{
	print(...messages: (string | any)[]): void;
	error(...errors: (string | any)[]): void;
	prompt(
		message: string,
		defaultText: string
	): string | null;
	alert(message: string): void;
}
export interface IComparable<T>
{
	compareTo(this: IComparable<T>, other: IComparable<T>): number;
}