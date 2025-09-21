import { type ViewContainer, type Application } from 'pixi.js';

import { type ComponentConstructor } from '../../../../engine/component';
import { Sprite } from '../../../components/sprite';
import { Shape } from '../../../components/shape';
import { PixiView } from '../../../components/pixi-view';
import { Text } from '../../../components/text';
import { Transform } from '../../../components/transform';
import { type Actor } from '../../../../engine/actor';
import { type SortFn } from '../sort';
import { type Bounds, type ViewComponent } from '../types';

const VIEW_COMPONENTS: ComponentConstructor[] = [Sprite, Shape, PixiView, Text];

interface RendererServiceOptions {
  application: Application;
  getViewEntries: () => ViewContainer[] | undefined;
  sortFn: SortFn;
}

export class RendererService {
  private application: Application;
  private getViewEntries: () => ViewContainer[] | undefined;
  private sortFn: SortFn;

  constructor({ application, getViewEntries, sortFn }: RendererServiceOptions) {
    this.application = application;
    this.getViewEntries = getViewEntries;
    this.sortFn = sortFn;
  }

  getRenderingContext(): Application {
    return this.application;
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

    let minX = transform.offsetX;
    let minY = transform.offsetY;
    let maxX = transform.offsetX;
    let maxY = transform.offsetY;

    VIEW_COMPONENTS.forEach((ViewComponent) => {
      const viewComponent = actor.getComponent(ViewComponent) as ViewComponent;
      const bounds = viewComponent?.renderData?.view.__dacha.bounds;

      if (!bounds) {
        return;
      }

      minX = Math.min(minX, bounds?.minX);
      minY = Math.min(minY, bounds?.minY);
      maxX = Math.max(maxX, bounds?.maxX);
      maxY = Math.max(maxY, bounds?.maxY);
    });

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
