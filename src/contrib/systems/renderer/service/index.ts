import { type ViewContainer, type Application, type Container } from 'pixi.js';

import { Transform } from '../../../components/transform';
import { type Actor } from '../../../../engine/actor';
import { type SortFn } from '../sort';
import { type Bounds, type ViewComponent } from '../types';
import { VIEW_COMPONENTS } from '../consts';
import type { FilterSystem } from '../filters';
import type { MaterialSystem } from '../material';
import type { ShaderConstructor } from '../material/shader';

import { convertBounds } from './utils';

interface RendererServiceOptions {
  application: Application;
  worldContainer: Container;
  getViewEntries: () => Set<ViewContainer> | undefined;
  sortFn: SortFn;
  filterSystem: FilterSystem;
  materialSystem: MaterialSystem;
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
  private worldContainer: Container;
  private getViewEntries: () => Set<ViewContainer> | undefined;
  private sortFn: SortFn;
  private filterSystem: FilterSystem;
  private materialSystem: MaterialSystem;

  constructor({
    application,
    worldContainer,
    getViewEntries,
    sortFn,
    filterSystem,
    materialSystem,
  }: RendererServiceOptions) {
    this.application = application;
    this.worldContainer = worldContainer;
    this.getViewEntries = getViewEntries;
    this.sortFn = sortFn;
    this.filterSystem = filterSystem;
    this.materialSystem = materialSystem;
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

    const inverseMatrix = this.worldContainer.worldTransform.clone().invert();

    this.getViewEntries()?.forEach((entry) => {
      const { minX, minY, maxX, maxY } = convertBounds(entry, inverseMatrix);

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
    const { world } = actor.getComponent(Transform);

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const inverseMatrix = this.worldContainer.worldTransform.clone().invert();

    VIEW_COMPONENTS.forEach((ViewComponent) => {
      const viewComponent = actor.getComponent(ViewComponent) as ViewComponent;

      if (!viewComponent?.renderData?.view) {
        return;
      }

      const bounds = convertBounds(
        viewComponent.renderData.view,
        inverseMatrix,
      );

      minX = Math.min(minX, bounds?.minX);
      minY = Math.min(minY, bounds?.minY);
      maxX = Math.max(maxX, bounds?.maxX);
      maxY = Math.max(maxY, bounds?.maxY);
    });

    if (minX === Infinity) {
      return {
        minX: world.position.x,
        minY: world.position.y,
        maxX: world.position.x,
        maxY: world.position.y,
        width: 0,
        height: 0,
      };
    }

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Adds a post-processing effect that applies to the entire scene.
   * Effects are applied in the order they are added.
   *
   * @param name - Filter effect name
   * @param options - Filter configuration options
   * @returns Effect id used for removal
   */
  addFilterEffect(name: string, options: Record<string, unknown>): string {
    return this.filterSystem.addEffect(name, options);
  }

  /**
   * Removes a filter effect by id.
   *
   * @param id - Effect id returned by addFilterEffect
   */
  removeFilterEffect(id: string): void {
    this.filterSystem.removeEffect(id);
  }

  /**
   * Clears all active filter effects.
   */
  clearFilterEffects(): void {
    this.filterSystem.clear();
  }

  /**
   * Reloads shader classes registered in the renderer.
   *
   * @param classDenfinitions - Shader constructors to register
   */
  reloadShaders(classDenfinitions: ShaderConstructor[]): void {
    this.materialSystem.reloadShaders(classDenfinitions);
  }
}
