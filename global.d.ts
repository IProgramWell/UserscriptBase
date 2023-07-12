interface ResponseObject<ContextType = any>
{
	status: number;
	statusText: string;
	readyState: number;
	responseHeaders: string;
	response: string | Blob | ArrayBuffer | Document | Object | null;
	responseText: string | undefined;
	finalUrl: string;
	context: ContextType;
}
interface HeaderObj extends Record<PropertyKey, any>
{
	Cookie: string;
	Host: string;
	Origin: string;
	Referer: string;
	"User-Agent": string;
}

declare global
{
	// const GM_info: {
	var GM_info: {
		/**A unique ID of the script. */
		uuid: string;
		/** The meta block of the script. */
		scriptMetaStr: string;
		/** Whether the script will be updated automatically. */
		scriptWillUpdate: boolean;
		/** The name of userscript manager, which should be the string `Violentmonkey`. */
		scriptHandler: string;
		/** Version of Violentmonkey. */
		version: string;
		/** Unlike `navigator.userAgent`, which can be overriden by other extensions/userscripts or by devtools in device-emulation mode, `GM_info.platform` is more reliable as the data is obtained in the background page of Violentmonkey using a specialized extension API (browser.runtime.getPlatformInfo and getBrowserInfo). */
		platform: {
			arch: "arm" | "mips" | "mips64" | "x86-32" | "x86-64";
			browserName: "chrome" | "firefox";
			browserVersion: string;
			os: "android" | "cros" | "linux" | "mac" | "openbsd" | "win";
		};
		/** Contains structured fields from the {@link https://violentmonkey.github.io/api/metadata-block/ Metadata Block} */
		script: {
			description: string;
			excludes: string[];
			includes: string[];
			matches: string[];
			name: string;
			namespace: string;
			// resources: string[];
			resources: Array<{ name: string, url: string }>;
			runAt: "document-start" | "document-end" | "document-idle";
			version: string;
		};
		injectInto: "page" | "content" | "auto";
	};
	/**
	 * Retrieves a value for current script from storage.
	 * @param key The name for `value` to load.
	 * @param defaultValue The default value to return if no value exists in the storage.
	 */
	function GM_getValue<T>(key: string, defaultValue?: T): T | undefined;
	/**
	 * Sets a key / value pair for current script to storage.
	 * @param key The unique name for `value` within this script.
	 * @param value The value to be stored, which must be JSON serializable (string, number, boolean, null, or an array/object consisting of these types) so for example you can't store DOM elements or objects with cyclic dependencies.
	 */
	function GM_setValue<T>(key: string, value: T): void;
	/**
	 * Deletes an existing key / value pair for current script from storage.
	 * @param key The unique name for `value` within this script.
	 */
	function GM_deleteValue(key: string): void;
	/**
	 * Returns an array of keys of all available values within this script.
	 */
	function GM_listValues(): any[];
	/**
	 * Adds a change listener to the storage and returns the listener ID.
	 * @param name The name of the observed variable
	 * @param callback 
	 */
	function GM_addValueChangeListener(
		name: string,
		callback: {
			<T>(
				name: string,
				oldValue: T | undefined,
				newValue: T | undefined,
				remote: boolean
			): void;
		}
	): string;
	/**
	 * Removes a change listener by its ID.
	 * @param listenerId 
	 */
	function GM_removeValueChangeListener(listenerId: string): void;
	/**
	 * Retrieves a text resource from the metadata block.
	 * @param name Name of a resource defined in the {@link https://violentmonkey.github.io/api/metadata-block/#resource metadata block}.
	 */
	function GM_getResourceText(name: string): string;
	/**
	 * 
	 * @param name Name of a resource defined in the {@link https://violentmonkey.github.io/api/metadata-block/#resource metadata block}.
	 * @param isBlobUrl Whether to return a `blob` url (shortened description. See docs for full).
	 * @see https://violentmonkey.github.io/api/metadata-block/#resource
	 */
	function GM_getResourceURL(name: string, isBlobUrl?: boolean): string;
	/**
	 * Appends and returns an element with the specified attributes.
	 * @see https://violentmonkey.github.io/api/gm/#gm_addelement
	 */
	function GM_addElement(tagName: string, attributes: Record<PropertyKey, any>): HTMLElement;
	/**
	 * Appends and returns an element with the specified attributes.
	 * @see https://violentmonkey.github.io/api/gm/#gm_addelement
	 */
	function GM_addElement(parentNode: HTMLElement, tagName: string, attributes: Record<PropertyKey, any>): HTMLElement;
	/**
	 * Appends and returns a `<style>` element with the specified CSS.
	 * @param css 
	 */
	function GM_addStyle(css: string): HTMLStyleElement;
	/**
	 * Opens URL in a new tab.
	 * @param url 
	 * @param options 
	 * @see https://violentmonkey.github.io/api/gm/#gm_openintab
	 */
	function GM_openInTab(url: string, options?: Record<PropertyKey, any>):
		{
			/** Сan be assigned to a function. If provided, it will be called when the opened tab is closed. */
			onclose?(): void;
			/** Whether the opened tab is closed. */
			closed: boolean;
			/** A function to explicitly close the opened tab */
			close(): void;
		};
	function GM_openInTab(url: string, openInBackground: boolean):
		{
			/** Сan be assigned to a function. If provided, it will be called when the opened tab is closed. */
			onclose?(): void;
			/** Whether the opened tab is closed. */
			closed: boolean;
			/** A function to explicitly close the opened tab */
			close(): void;
		}
	/**
	 * Registers a command in Violentmonkey popup menu.
	 * @param caption 
	 * @param onclick 
	 * @see https://violentmonkey.github.io/api/gm/#gm_registermenucommand
	 */
	function GM_registerMenuCommand(caption: string, onclick: (event: MouseEvent | KeyboardEvent) => void): string;
	/**
	 * Unregisters a command which has been registered to Violentmonkey popup menu.
	 * @param caption 
	 * @see https://violentmonkey.github.io/api/gm/#gm_unregistermenucommand
	 */
	function GM_unregisterMenuCommand(caption: string): void;
	/**
	 * Shows an HTML5 desktop notification.
	 * @param options 
	 * @see https://violentmonkey.github.io/api/gm/#gm_notification
	 */
	function GM_notification(options: {
		text: string;
		title?: string;
		image?: string;
		onclick?(): void;
		ondone?(): void;
	}): { remove(): Promise<unknown>; };
	/**
	 * Shows an HTML5 desktop notification.
	 * @see https://violentmonkey.github.io/api/gm/#gm_notification
	 */
	function GM_notification(text: string, title?: string, image?: string, onclick?: () => void):
		{ remove(): Promise<unknown>; };
	/**
	 * Sets data to system clipboard.
	 * @param data 
	 * @param type 
	 * @see https://violentmonkey.github.io/api/gm/#gm_setclipboard
	 */
	function GM_setClipboard(data: string, type: string): void;
	/**
	 * Makes a request like XMLHttpRequest, with some special capabilities, not restricted by same-origin policy.
	 * @param details 
	 * @see https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
	 */
	function GM_xmlhttpRequest<ContextType = any>(details: {
		url: string;
		method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
		user?: string;
		password?: string;
		overrideMimeType?: string;
		headers?: HeaderObj;
		responseType?: "text" | "json" | "blob" | "arraybuffer" | "document";
		timeout?: number;
		data?: string | FormData | Blob;
		binary?: boolean;
		context?: ContextType;
		anonymous?: boolean;
		onabort?(responseObject: ResponseObject<ContextType>): void;
		onerror?(responseObject: ResponseObject<ContextType>): void;
		onload?(responseObject: ResponseObject<ContextType>): void;
		onloadend?(responseObject: ResponseObject<ContextType>): void;
		onloadstart?(responseObject: ResponseObject<ContextType>): void;
		onprogress?(responseObject: ResponseObject<ContextType>): void;
		onreadystatechange?(responseObject: ResponseObject<ContextType>): void;
		ontimeout?(responseObject: ResponseObject<ContextType>): void;
	}): { abort(): void; };
	/**
	 * Downloads a URL to a local file.
	 * @param options 
	 * @see https://violentmonkey.github.io/api/gm/#gm_download
	 */
	function GM_download<ContextType = any>(options: {
		url: string;
		name?: string;
		onload?(): void;
		headers?: HeaderObj;
		timeout?: number;
		onerror?(responseObject: ResponseObject<ContextType>): void;
		onprogress?(responseObject: ResponseObject<ContextType>): void;
		ontimeout?(responseObject: ResponseObject<ContextType>): void;
	}): void;
	/**
	 * Downloads a URL to a local file.
	 * @see https://violentmonkey.github.io/api/gm/#gm_download
	 */
	function GM_download(url: string, name?: string): void;

	namespace GM
	{
		function addStyle(...args: Parameters<typeof GM_addStyle>): ReturnType<typeof GM_addStyle>;
		function addElement(...args: Parameters<typeof GM_addElement>): ReturnType<typeof GM_addElement>;
		function registerMenuCommand(...args: Parameters<typeof GM_registerMenuCommand>): ReturnType<typeof GM_registerMenuCommand>;
		function deleteValue(...args: Parameters<typeof GM_deleteValue>): Promise<ReturnType<typeof GM_deleteValue>>;
		function getResourceUrl(...args: Parameters<typeof GM_getResourceURL>): Promise<ReturnType<typeof GM_getResourceURL>>;
		function getResourceURL(...args: Parameters<typeof GM_getResourceURL>): Promise<ReturnType<typeof GM_getResourceURL>>;
		function getValue(...args: Parameters<typeof GM_getValue>): Promise<ReturnType<typeof GM_getValue>>;
		const info: typeof GM_info;
		function listValues(...args: Parameters<typeof GM_listValues>): Promise<ReturnType<typeof GM_listValues>>;
		function notification(...args: Parameters<typeof GM_notification>): ReturnType<typeof GM_notification>;
		function openInTab(...args: Parameters<typeof GM_openInTab>): ReturnType<typeof GM_openInTab>;
		function setClipboard(...args: Parameters<typeof GM_setClipboard>): ReturnType<typeof GM_setClipboard>;
		function setValue(...args: Parameters<typeof GM_setValue>): Promise<ReturnType<typeof GM_setValue>>;
		function xmlHttpRequest(...args: Parameters<typeof GM_xmlhttpRequest>): ReturnType<typeof GM_xmlhttpRequest>;
	}
}

export { };