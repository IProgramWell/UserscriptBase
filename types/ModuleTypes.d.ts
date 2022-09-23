export type ModuleEventHandler<Args extends Array<any> = [], Return = any | null | undefined> = (...args: Args) => Return;