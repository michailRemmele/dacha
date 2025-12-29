import type { ViewContainer } from 'pixi.js';

import type { Actor } from '../../../../engine/actor';
import type { Component } from '../../../../engine/component';
import type { ViewComponent } from '../types';

export interface Builder<T extends Component = ViewComponent> {
  destroy(component: T): void;
  buildView(component: T, actor: Actor): ViewContainer;
  updateView(component: T): void;
}
