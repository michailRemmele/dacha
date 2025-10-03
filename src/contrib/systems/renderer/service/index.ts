import { type ViewContainer, type Application } from 'pixi.js';

import { type ComponentConstructor } from '../../../../engine/component';
import { Sprite } from '../../../components/sprite';
import { Shape } from '../../../components/shape';
import { PixiView } from '../../../components/pixi-view';
import { BitmapText } from '../../../components/bitmap-text';
import { Transform } from '../../../components/transform';
import { type Actor } from '../../../../engine/actor';
import { type SortFn } from '../sort';
import { type Bounds, type ViewComponent } from '../types';

const VIEW_COMPONENTS: ComponentConstructor[] = [
  Sprite,
  Shape,
  PixiView,
  BitmapText,
];

interface RendererServiceOptions {
  application: Application;
  getViewEntries: () => ViewContainer[] | undefined;
  sortFn: SortFn;
}

/**
 * Service that provides rendering utilities and view management
 *
 * Offers methods for view intersection testing, bounds calculation, and
 * direct access to the underlying PIXI.js application
 * 
 * @category Systems
 */
export class RendererService {
  private application: Application;
  private getViewEntries: () => ViewContainer[] | undefined;
  private sortFn: SortFn;

  constructor({ application, getViewEntries, sortFn }: RendererServiceOptions) {
    this.application = application;
    this.getViewEntries = getViewEntries;
    this.sortFn = sortFn;
  }

  /**
   * Returns the underlying PIXI.js application
   *
   * @returns PIXI.js application instance
   */
  getRenderingContext(): Application {
    return this.application;
  }

  /**
   * Returns the actors that intersect with a point
   *
   * @param x - X coordinate of the point in scene coordinates
   * @param y - Y coordinate of the point in scene coordinates
   * @returns Actors that intersect with the point
   */
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

  /**
   * Returns the actors that intersect with a rectangle
   * All coordinates should be passed in scene coordinates
   *
   * @param minX - X coordinate of the minimum point
   * @param minY - Y coordinate of the minimum point
   * @param maxX - X coordinate of the maximum point
   * @param maxY - Y coordinate of the maximum point
   * @returns Actors that intersect with the rectangle
   */
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

  /**
   * Returns the bounds of an actor
   * If actor has multiple views,
   * the bounds will be the smallest rectangle that contains all views
   *
   * @param actor - Actor to get the bounds of
   * @returns Bounds of the actor
   */
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
