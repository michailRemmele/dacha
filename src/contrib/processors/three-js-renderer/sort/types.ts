import type { GameObject } from '../../../../engine/gameObject';

export type SortFn = (a: GameObject, b: GameObject) => number;
