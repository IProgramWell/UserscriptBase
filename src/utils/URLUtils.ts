export function navigate(NewURL: string | URL | Location): void
{
	document.location.assign(NewURL.toString());
}

export function setLocationAttribute(
	AttrName: "hash" |
		"host" |
		"hostname" |
		"href" |
		"pathname" |
		"port" |
		"protocol" |
		"search",
	AttrValue: string
): void
{
	document.location[AttrName] = AttrValue;
}

export function openNewTab(URL: string | URL | Location): void
{
	globalThis.open(URL.toString(), "_blank");
}

export function getCurrentLocation(): URL | Location
{
	return document.location;
}