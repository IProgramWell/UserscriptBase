export interface IYTCustomEvent<T = any> extends Event
{
	detail: {
		pageData: {
			endpoint: {
				browserEndpoint: {
					browserId: string;
				};
				clickTrackingParams: string;
				commandMetadata: {
					webCommandMetadata: {
						apiUrl: string;
						rootVe: number;
						webPageType: string;
					}
				}
			};
			page: string;
			response: T;
			rootVe: number;
			url: string;
		}
	}
}
export default IYTCustomEvent;