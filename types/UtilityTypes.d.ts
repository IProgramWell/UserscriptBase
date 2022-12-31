export type TimeStampFormat = "ISO" | "UTC" | "Locale" | "Milliseconds" | "Human";
export interface IOManagerOptions
{
	name: string;
	logTimestamp: boolean;
	timestampFormat: TimeStampFormat;
	isInIFrame?: boolean;
}

export interface QueryCallback<
	R extends NodeList | XPathResult =
	NodeList | XPathResult
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