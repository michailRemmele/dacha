import { type ViewContainer } from 'pixi.js';

import type { SortFn } from './types';

export const sortByYAxis: SortFn = (
  a: ViewContainer,
  b: ViewContainer,
): number => {
  const aComponent = a.__dacha.viewComponent;
  const bComponent = b.__dacha.viewComponent;
  const aY = a.__dacha.bounds.maxY;
  const bY = b.__dacha.bounds.maxY;

  const aOffsetY = aY + aComponent.sortCenter[1];
  const bOffsetY = bY + bComponent.sortCenter[1];

  return aOffsetY - bOffsetY;
};
