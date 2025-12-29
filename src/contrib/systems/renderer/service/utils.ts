import { type Container, Point, type Matrix } from 'pixi.js';

import { type Bounds } from '../types';

export const convertBounds = (container: Container, matrix: Matrix): Bounds => {
  const bounds = container.getBounds();

  const topLeft = matrix.apply(new Point(bounds.x, bounds.y));
  const bottomRight = matrix.apply(
    new Point(bounds.x + bounds.width, bounds.y + bounds.height),
  );

  return {
    minX: topLeft.x,
    minY: topLeft.y,
    maxX: bottomRight.x,
    maxY: bottomRight.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
  };
};
