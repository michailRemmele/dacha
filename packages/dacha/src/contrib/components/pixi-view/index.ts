import type { ViewContainer } from 'pixi.js';

import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';

interface RenderData {
  view: ViewContainer;
}

/**
 * Options for {@link PixiView}.
 *
 * @category Rendering
 */
export interface PixiViewConfig {
  createView?: () => ViewContainer;
  sortingLayer?: string;
  sortOffset?: Point;
}

/**
 * Draws a pixi.js object that you create in code.
 *
 * @example
 * ```ts
 * actor.setComponent(
 *   new PixiView({
 *     createView: () => new Graphics().circle(0, 0, 50).fill(0xffffff),
 *   }),
 * );
 * ```
 *
 * @see [PixiView](https://dachajs.org/systems/rendering/components/#pixiview)
 *
 * @category Rendering
 */
export class PixiView extends Component {
  /** Function to create a custom pixi.js view */
  createView?: () => ViewContainer;
  /** Sorting layer of the pixi view */
  sortingLayer: string;
  /** Center point of the pixi view */
  sortOffset: Point;
  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;

  /**
   * Creates a new PixiView component.
   *
   * @param config - Configuration for the pixi view
   */
  constructor(config: PixiViewConfig) {
    super();

    this.createView = config.createView;
    this.sortingLayer = config.sortingLayer ?? 'default';
    this.sortOffset = {
      x: config.sortOffset?.x ?? 0,
      y: config.sortOffset?.y ?? 0,
    };
  }

  /** The pixi.js view. It is available only after the actor with this component is added to a scene */
  get view(): ViewContainer | undefined {
    return this.renderData?.view;
  }
}

PixiView.componentName = 'PixiView';
