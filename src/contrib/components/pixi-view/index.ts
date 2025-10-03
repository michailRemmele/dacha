import type { ViewContainer } from 'pixi.js';

import { Component } from '../../../engine/component';

interface RenderData {
  view: ViewContainer;
}

export interface PixiViewConfig {
  createView: () => ViewContainer;
  sortingLayer: string;
  sortCenter: [number, number];
}

/**
 * PixiView component for rendering a view.
 *
 * Handles the visual representation of an actor using a custom pixi.js view.
 * It gives more control over the rendering of the actor and allows to use pixi.js features that are not supported by other components.
 *
 * @example
 * ```typescript
 * // Create a pixi view
 * const pixiView = new PixiView({
 *   createView: () => {
 *     const graphics = new Graphics()
 *      .rect(0, 0, 100, 100)
 *      .fill({ color: 0x000000 })
 *      .circle(0, 0, 50)
 *      .stroke({ color: 0x000000, width: 2 });
 *     return graphics;
 *   },
 *   sortingLayer: 'units',
 *   sortCenter: [0, 0],
 * });
 *
 * // Add to actor
 * actor.setComponent(pixiView);
 * ```
 * 
 * @category Components
 */
export class PixiView extends Component {
  /** Function to create a custom pixi.js view */
  createView: () => ViewContainer;
  /** Sorting layer of the pixi view */
  sortingLayer: string;
  /** Center point of the pixi view */
  sortCenter: [number, number];
  /** Internal rendering data */
  renderData?: RenderData;

  /**
   * Creates a new PixiView component.
   * 
   * @param config - Configuration for the pixi view
   */
  constructor(config: PixiViewConfig) {
    super();

    this.createView = config.createView;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
  }

  /** Get the pixi.js view. It's only available after the actor with this component is added to a scene */
  get view(): ViewContainer | undefined {
    return this.renderData?.view;
  }

  clone(): PixiView {
    return new PixiView({
      createView: this.createView,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
    });
  }
}

PixiView.componentName = 'PixiView';
