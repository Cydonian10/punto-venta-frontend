export type KeysWithoutId<T> = Exclude<keyof T, 'id'>;
