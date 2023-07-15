export default class DetailedEvent<D> extends Event
{
	detail: D;

	constructor (type: string, detail: D, eventInitDict?: EventInit)
	{
		super(type, eventInitDict);
		this.detail = detail;
	}
}