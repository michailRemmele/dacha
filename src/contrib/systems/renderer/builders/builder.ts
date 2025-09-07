import type { ViewContainer } from 'pixi.js';

import type { Actor } from '../../../../engine/actor';

export interface Builder {
  destroy(actor: Actor): void;
  buildView(actor: Actor): ViewContainer | undefined;
  updateView(actor: Actor): void;
}
