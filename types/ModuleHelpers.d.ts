import type { PageModule } from "modules";

export interface ModuleEvents
{
	init?(this: PageModule): void;
	onDocumentLoad?(this: PageModule): boolean;
	onDocumentStart?(this: PageModule): boolean;
	onModuleStart?(this: PageModule): boolean;
	onModuleStop?(this: PageModule): boolean;
	// onUrlChange?(this: PageModule, url: URL | Location | string): boolean;
}
export interface ModuleState
{
	[key: PropertyKey]: any;
}