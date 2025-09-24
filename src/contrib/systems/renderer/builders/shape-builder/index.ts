import { Graphics, GraphicsContext, Bounds } from 'pixi.js';

import type { Builder } from '../builder';
import { BLEND_MODE_MAPPING } from '../../consts';
import { Transform } from '../../../../components/transform';
import { Shape } from '../../../../components/shape';
import type { Actor } from '../../../../../engine/actor';
import { CacheStore } from '../../../../../engine/data-lib';
import { floatEquals } from '../utils';

import { getGraphicsContext, getGraphicsContextKey } from './utils';

export class ShapeBuilder implements Builder {
  private graphicsContextMap: CacheStore<GraphicsContext>;

  constructor() {
    this.graphicsContextMap = new CacheStore();
  }

  destroy(actor: Actor): void {
    const shape = actor.getComponent(Shape);
    const graphicsContextKey = shape.renderData?.graphicsContextKey;

    if (graphicsContextKey) {
      this.graphicsContextMap.release(graphicsContextKey, true);
    }

    shape.renderData?.view.destroy();
    shape.renderData = undefined;
  }

  buildView(actor: Actor): Graphics | undefined {
    const shape = actor.getComponent(Shape);
    if (!shape) {
      return undefined;
    }

    const { offsetX, offsetY } = actor.getComponent(Transform);
    const view = new Graphics();

    shape.renderData = { view };
    view.__dacha = {
      actor,
      builderKey: Shape.componentName,
      viewComponent: shape,
      bounds: new Bounds(offsetX, offsetY, offsetX, offsetY),
      meta: {},
      didChange: false,
    };

    return view;
  }

  updateView(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const shape = actor.getComponent(Shape);

    if (!shape) {
      return undefined;
    }

    const view = shape.renderData!.view;
    const meta = view.__dacha.meta;

    view.__dacha.didChange = false;

    if (shape.disabled !== meta.disabled) {
      view.visible = !shape.disabled;
      meta.disabled = shape.disabled;
      view.__dacha.didChange = true;
    }

    if (shape.blending !== meta.blending) {
      view.blendMode = BLEND_MODE_MAPPING[shape.blending];
      meta.blending = shape.blending;
      view.__dacha.didChange = true;
    }

    if (shape.opacity !== meta.opacity) {
      view.alpha = shape.opacity;
      meta.opacity = shape.opacity;
      view.__dacha.didChange = true;
    }

    const angle = transform.rotation;
    if (angle !== meta.angle) {
      view.angle = angle;
      meta.angle = angle;
      view.__dacha.didChange = true;
    }

    const { offsetX, offsetY } = transform;
    if (
      !floatEquals(offsetX, meta.offsetX as number) ||
      !floatEquals(offsetY, meta.offsetY as number)
    ) {
      view.position.set(offsetX, offsetY);
      meta.offsetX = offsetX;
      meta.offsetY = offsetY;
      view.__dacha.didChange = true;
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
      view.__dacha.didChange = true;
    }

    const graphicsContext = this.getGraphicsContext(shape)!;
    view.context = graphicsContext;

    const { scaleX, scaleY } = transform;
    if (scaleX !== meta.scaleX || scaleY !== meta.scaleY) {
      view.scale.set(scaleX, scaleY);
      meta.scaleX = scaleX;
      meta.scaleY = scaleY;
      view.__dacha.didChange = true;
    }
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
