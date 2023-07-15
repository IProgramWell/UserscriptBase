export type TimeStampFormat = "ISO" | "UTC" | "Locale" | "Milliseconds" | "Human";

export interface IOManagerOptions
{
	name: string;
	logTimestamp: boolean;
	timestampFormat: TimeStampFormat;
	isInIFrame?: boolean;
}

export interface AwaitedQuery<R extends Element[] = Element[]>
{
	query: string;
	callback(elements: R): void;
	removeWhenFound?: boolean;
}
