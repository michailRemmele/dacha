import { Graphics, GraphicsContext } from 'pixi.js';

import type { Builder } from '../builder';
import { BLEND_MODE_MAPPING } from '../../consts';
import { Shape } from '../../../../components/shape';
import type { Actor } from '../../../../../engine/actor';
import { CacheStore } from '../../../../../engine/data-lib';

import { getGraphicsContext, getGraphicsContextKey } from './utils';

export class ShapeBuilder implements Builder<Shape> {
  private graphicsContextMap: CacheStore<GraphicsContext>;

  constructor() {
    this.graphicsContextMap = new CacheStore();
  }

  destroy(shape: Shape): void {
    const graphicsContextKey = shape.renderData?.graphicsContextKey;

    if (graphicsContextKey) {
      this.graphicsContextMap.release(graphicsContextKey, true);
    }

    shape.renderData?.view.destroy();
    shape.renderData = undefined;
  }

  buildView(shape: Shape, actor: Actor): Graphics {
    const view = new Graphics();

    shape.renderData = { view };
    view.__dacha = {
      actor,
      builderKey: Shape.componentName,
      viewComponent: shape,
      meta: {},
    };

    this.updateView(shape);

    return view;
  }

  updateView(shape: Shape): void {
    const view = shape.renderData!.view;
    const meta = view.__dacha.meta;

    if (shape.disabled !== meta.disabled) {
      view.visible = !shape.disabled;
      meta.disabled = shape.disabled;
    }

    if (shape.blending !== meta.blending) {
      view.blendMode = BLEND_MODE_MAPPING[shape.blending];
      meta.blending = shape.blending;
    }

    if (shape.opacity !== meta.opacity) {
      view.alpha = shape.opacity;
      meta.opacity = shape.opacity;
    }

    if (
      shape.type !== meta.type ||
      shape.strokeWidth !== meta.strokeWidth ||
      shape.strokeColor !== meta.strokeColor ||
      shape.fill !== meta.fill ||
      shape.width !== meta.width ||
      shape.height !== meta.height ||
      shape.radius !== meta.radius ||
      shape.radiusX !== meta.radiusX ||
      shape.radiusY !== meta.radiusY
    ) {
      view.label = shape.type;
      this.updateGraphicsContext(shape);
      meta.type = shape.type;
      meta.strokeWidth = shape.strokeWidth;
      meta.strokeColor = shape.strokeColor;
      meta.fill = shape.fill;
      meta.width = shape.width;
      meta.height = shape.height;
      meta.radius = shape.radius;
      meta.radiusX = shape.radiusX;
      meta.radiusY = shape.radiusY;
    }

    const graphicsContext = this.getGraphicsContext(shape)!;
    view.context = graphicsContext;
  }

  private updateGraphicsContext(shape: Shape): void {
    const oldGraphicsContextKey = shape.renderData!.graphicsContextKey;

    if (oldGraphicsContextKey) {
      this.graphicsContextMap.release(oldGraphicsContextKey, true);
    }

    shape.renderData!.graphicsContextKey = getGraphicsContextKey(shape);

    const graphicsContextKey = shape.renderData!.graphicsContextKey!;

    if (this.graphicsContextMap.has(graphicsContextKey)) {
      this.graphicsContextMap.retain(graphicsContextKey);
      return;
    }

    const graphicsContext = getGraphicsContext(shape);

    this.graphicsContextMap.add(graphicsContextKey, graphicsContext);

    this.graphicsContextMap.retain(graphicsContextKey);
  }

  private getGraphicsContext(shape: Shape): GraphicsContext | undefined {
    return this.graphicsContextMap.get(shape.renderData!.graphicsContextKey!);
  }
}
