import { ViewContainer } from 'pixi.js';

import { Sprite } from '../../../components/sprite';
import { Transform } from '../../../components/transform';
import { type Actor } from '../../../../engine/actor';
import { type SortFn } from '../sort';
import { type Bounds } from '../types';

interface RendererServiceOptions {
  getViewEntries: () => ViewContainer[] | undefined;
  sortFn: SortFn;
}

export class RendererService {
  private getViewEntries: () => ViewContainer[] | undefined;
  private sortFn: SortFn;

  constructor({ getViewEntries, sortFn }: RendererServiceOptions) {
    this.getViewEntries = getViewEntries;
    this.sortFn = sortFn;
  }

  intersectsWithPoint(x: number, y: number): Actor[] {
    const intersects = new Set<ViewContainer>();

    this.getViewEntries()?.forEach((entry) => {
      const { minX, minY, maxX, maxY } = entry.__dacha.bounds;

      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        intersects.add(entry);
      }
    });

    // TODO: Find more efficient way to return intersected objects in right order
    // according to posititon and sorting layer
    return Array.from(intersects)
      .sort(this.sortFn)
      .reverse()
      .map((entry) => entry.__dacha.actor);
  }

  intersectsWithRectangle(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ): Actor[] {
    const actors = new Set<Actor>();

    this.getViewEntries()?.forEach((entry) => {
      const { x, y } = entry.position;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        actors.add(entry.__dacha.actor);
      }
    });
    return Array.from(actors);
  }

  getBounds(actor: Actor): Bounds {
    const transform = actor.getComponent(Transform);
    const sprite = actor.getComponent(Sprite);

    const spriteBounds = sprite?.renderData?.view.__dacha.bounds;

    const minX = spriteBounds?.minX ?? transform.offsetX;
    const minY = spriteBounds?.minY ?? transform.offsetY;
    const maxX = spriteBounds?.maxX ?? transform.offsetX;
    const maxY = spriteBounds?.maxY ?? transform.offsetY;

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
}
