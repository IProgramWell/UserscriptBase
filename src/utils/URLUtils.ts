export function navigate(NewURL: string | URL | Location)
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
)
{
	document.location[AttrName] = AttrValue;
}

export function openNewTab(URL: string | URL | Location)
{
	if (globalThis.GM_openInTab)
		GM_openInTab(URL.toString());
	else
		globalThis.open(URL.toString(), "_blank");
}

export function getCurrentLocation()
{
	return document.location;
}