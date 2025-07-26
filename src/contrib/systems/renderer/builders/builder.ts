import type { ViewContainer } from 'pixi.js';

import type { Actor } from '../../../../engine/actor';

export interface Builder {
  destroy(actor: Actor): void;
  hasView(actor: Actor): boolean;
  buildView(actor: Actor): ViewContainer;
  updateView(actor: Actor, zIndex: number): void;
}
