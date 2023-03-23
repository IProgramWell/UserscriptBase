export type EntryArray<T, K extends keyof T = keyof T> = [
	K,
	T[K]
][];
export interface Func<A extends Array<any>, R, T = unknown> { (this: T, ...args: A): R; }
export interface Action<A extends Array<any>> { (...args: A): void; }