type GMFunc = `GM_${"info" |
	"getValue" |
	"setValue" |
	"deleteValue" |
	"listValues" |
	"addValueChangeListener" |
	"removeValueChangeListener" |
	"getResourceText" |
	"getResourceURL" |
	"addElement" |
	"addStyle" |
	"openInTab" |
	"registerMenuCommand" |
	"unregisterMenuCommand" |
	"notification" |
	"setClipboard" |
	"xmlhttpRequest" |
	"download"
	}`;

export interface Metadata
{
	name: string;
	namespace?: string;
	author?: string;
	match?: (string | RegExp)[];
	"exclude-match"?: (string | RegExp)[];
	include?: (string | RegExp)[];
	exclude?: (string | RegExp)[];
	version?: string;
	description?: string;
	icon?: string | URL;
	require?: (string | URL)[];
	resource?: {
		name: string,
		url: string | URL
	}[];
	"run-at"?: "document-end" | "document-start" | "document-idle";
	noframes?: boolean;
	grant?: ("none" | GMFunc)[];
	"inject-into"?: "page" | "content" | "auto";
	downloadURL?: string | URL;
	supportURL?: string | URL;
	homepageURL?: string | URL;
	unwrap?: boolean;
}