export function extractFromRequest(request: XMLHttpRequest):
	{
		response: {
			body: string | object;
			headers: Map<string, string | string[]>;
			status: number;
		};
		url: string;
	}
{
	const headers = getHeaders(request),
		contentType = headers.get("content-type") ?? "";

	return {
		response: {
			body: (Array.isArray(contentType)
				? contentType.some(ct =>
					ct.toLowerCase().startsWith("application/json")
				)
				: contentType.toLowerCase().startsWith("application/json")
			)
				? JSON.parse(request.responseText)
				: request.responseText,
			headers,
			status: request.status,
		},
		url: request.responseURL,
		// reqeust: request,
	};
}

export function getHeaders(reqeust: XMLHttpRequest): Map<string, string | string[]>
{
	return reqeust
		.getAllResponseHeaders()
		.split(new RegExp("\r?\n", "g"))
		.reduce(
			function (
				allHeaders: Map<string, string | string[]>,
				currentHeader: string
			): Map<string, string | string[]>
			{
				if (!currentHeader)
					return allHeaders;
				const eqIndex = currentHeader.indexOf(": ");
				const [name, value] = eqIndex < 0
					? [
						currentHeader
							.toLowerCase()
							.trim(),
						""
					]
					: [
						currentHeader
							.substring(0, eqIndex)
							.toLowerCase()
							.trim(),
						currentHeader
							.substring(eqIndex + 2)
							.trim(),
					];
				const existing = allHeaders.get(name);
				switch (typeof existing)
				{
					case "undefined":
						allHeaders.set(name, value);
						break;
					case "object":
						if (Array.isArray(existing))
							existing.push(value);
						break;
					case "string":
						allHeaders.set(name, [existing, value]);
						break;
				}
				return allHeaders;
			},
			new Map,
		);
}