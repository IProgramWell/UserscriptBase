export type EntryArray<T, K extends keyof T = keyof T> = [
	K,
	T[K]
][];