import { type ViewContainer } from 'pixi.js';

import type { SortFn } from './types';

export const sortByXAxis =
  (direction = 1): SortFn =>
  (a: ViewContainer, b: ViewContainer): number => {
    const aComponent = a.__dacha.viewComponent;
    const bComponent = b.__dacha.viewComponent;
    const aX = a.__dacha.bounds.maxX;
    const bX = b.__dacha.bounds.maxX;

    const aOffsetX = aX + aComponent.sortCenter[0];
    const bOffsetX = bX + bComponent.sortCenter[0];

    return (aOffsetX - bOffsetX) * direction;
  };
