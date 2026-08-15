import { type ViewContainer } from 'pixi.js';

import type { SortFn } from './types';

export const sortByYAxis =
  (direction = 1): SortFn =>
  (a: ViewContainer, b: ViewContainer): number => {
    const aComponent = a.__dacha.viewComponent;
    const bComponent = b.__dacha.viewComponent;
    const aY = a.getGlobalPosition(undefined, true).y;
    const bY = b.getGlobalPosition(undefined, true).y;

    const aOffsetY = aY + aComponent.sortOffset.y;
    const bOffsetY = bY + bComponent.sortOffset.y;

    return (aOffsetY - bOffsetY) * direction;
  };
