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

    if (this.shouldUpdateGraphicsContext(shape)) {
      view.label = shape.geometry.type;
      this.updateGraphicsContext(shape);
      this.updateGraphicsContextMeta(shape);
    }

    const graphicsContext = this.getGraphicsContext(shape)!;
    view.context = graphicsContext;
  }

  private shouldUpdateGraphicsContext(shape: Shape): boolean {
    const meta = shape.renderData!.view.__dacha.meta;
    const { geometry } = shape;

    if (
      geometry.type !== meta.type ||
      shape.strokeWidth !== meta.strokeWidth ||
      shape.strokeColor !== meta.strokeColor ||
      shape.strokeAlignment !== meta.strokeAlignment ||
      shape.fill !== meta.fill ||
      shape.pixelLine !== meta.pixelLine
    ) {
      return true;
    }

    switch (geometry.type) {
      case 'rectangle':
        return geometry.size.x !== meta.sizeX || geometry.size.y !== meta.sizeY;
      case 'roundRectangle':
        return (
          geometry.size.x !== meta.sizeX ||
          geometry.size.y !== meta.sizeY ||
          geometry.radius !== meta.radius
        );
      case 'circle':
        return geometry.radius !== meta.radius;
      case 'ellipse':
        return (
          geometry.radius.x !== meta.radiusX ||
          geometry.radius.y !== meta.radiusY
        );
      case 'line':
        return (
          geometry.point1.x !== meta.point1X ||
          geometry.point1.y !== meta.point1Y ||
          geometry.point2.x !== meta.point2X ||
          geometry.point2.y !== meta.point2Y
        );
    }
  }

  private updateGraphicsContextMeta(shape: Shape): void {
    const meta = shape.renderData!.view.__dacha.meta;
    const { geometry } = shape;

    meta.type = geometry.type;
    meta.strokeWidth = shape.strokeWidth;
    meta.strokeColor = shape.strokeColor;
    meta.strokeAlignment = shape.strokeAlignment;
    meta.fill = shape.fill;
    meta.pixelLine = shape.pixelLine;

    switch (geometry.type) {
      case 'rectangle':
        meta.sizeX = geometry.size.x;
        meta.sizeY = geometry.size.y;
        break;
      case 'roundRectangle':
        meta.sizeX = geometry.size.x;
        meta.sizeY = geometry.size.y;
        meta.radius = geometry.radius;
        break;
      case 'circle':
        meta.radius = geometry.radius;
        break;
      case 'ellipse':
        meta.radiusX = geometry.radius.x;
        meta.radiusY = geometry.radius.y;
        break;
      case 'line':
        meta.point1X = geometry.point1.x;
        meta.point1Y = geometry.point1.y;
        meta.point2X = geometry.point2.x;
        meta.point2Y = geometry.point2.y;
        break;
    }
  }

  private updateGraphicsContext(shape: Shape): void {
    const oldGraphicsContextKey = shape.renderData!.graphicsContextKey;

    if (oldGraphicsContextKey) {
      this.graphicsContextMap.release(oldGraphicsContextKey, true);
    }

    const graphicsContextKey = getGraphicsContextKey(shape);

    shape.renderData!.graphicsContextKey = graphicsContextKey;

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
