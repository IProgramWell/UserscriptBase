export type Optional<T = any> = T | null | undefined;
export type TypedObject<T = any> = Record<PropertyKey, T>;
export type EntryArray<T, K extends keyof T = keyof T> = [
	K,
	T[K]
][];