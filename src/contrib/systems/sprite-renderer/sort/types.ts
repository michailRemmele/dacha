import type { GameObject } from '../../../../engine/game-object';

export type SortFn = (a: GameObject, b: GameObject) => number;
