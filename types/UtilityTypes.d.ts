export type TimeStampFormat = "ISO" | "UTC" | "Locale" | "Milliseconds" | "Human";
export interface IOManagerOptions
{
	name: string;
	logTimestamp: boolean;
	timestampFormat: TimeStampFormat;
	isInIFrame?: boolean;
}

export type CSSQueryResult<T extends Element = Element> = Array<T>;

export interface QueryCallback<
	R extends CSSQueryResult = CSSQueryResult
> { (elements: R): void; }
export interface XPathQuery
{
	xpath: string;
	contextNode?: Node;
	namespaceResolver?: XPathNSResolver;
	resultType?: number;
	result?: XPathResult;
	isValidResult?(result: XPathResult): boolean;
}
export interface CSSQuery { selector: string; }