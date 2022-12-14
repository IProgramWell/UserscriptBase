/** Giving an alias to this long thing */
export interface TagMap extends HTMLElementTagNameMap { }

export type AttributeMap<TagName extends keyof TagMap = keyof TagMap> = {
	[TK in keyof TagMap[TagName]]: TagMap[TagName][TK] extends object
	? Partial<TagMap[TagName][TK]>
	: TagMap[TagName][TK]
} & { style: string; };