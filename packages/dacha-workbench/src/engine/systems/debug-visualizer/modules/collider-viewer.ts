import { Collider, Shape, Transform, type CapsuleColliderShape } from 'dacha';
import { Color } from 'pixi.js';

import { getCurrentZoom } from '../../../../utils/get-current-zoom';
import type { DebugViewModule } from '../types';

const DEFAULT_COLLIDER_COLOR = '#4DFFB8';
const FILL_COLOR_ALPHA = 0.15;
const STROKE_WIDTH = 1.5;

const DEFAULT_PROPS = {
  strokeWidth: 1,
  strokeAlignment: 1,
  pixelLine: false,
  opacity: 1,
  blending: 'normal' as Shape['blending'],
  disabled: false,
  sortingLayer: 'editor-layer-0',
  sortOffsetX: 0,
  sortOffsetY: 0,
};

const getCapsuleShape = (
  collider: Collider,
  transform: Transform,
  color: string,
  fillColor: string,
): Shape => {
  const { offset } = collider;
  const { point1, point2, radius } = collider.shape as CapsuleColliderShape;

  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;

  transform.local.rotation = Math.atan2(dy, dx);
  transform.local.position.x = offset.x + (point1.x + point2.x) / 2;
  transform.local.position.y = offset.y + (point1.y + point2.y) / 2;

  const length = Math.hypot(dx, dy);

  return new Shape({
    type: 'roundRectangle',
    sizeX: length + radius * 2,
    sizeY: radius * 2,
    radius,
    strokeColor: color,
    fill: fillColor,
    ...DEFAULT_PROPS,
  });
};

export const colliderViewer: DebugViewModule = {
  id: 'collider-viewer',
  title: 'Colliders',
  validate: (actor): boolean => Boolean(actor.getComponent(Collider)),
  build: (actor, options) => {
    const { actorSpawner } = options;

    const collider = actor.getComponent(Collider);

    const color = collider.debugColor ?? DEFAULT_COLLIDER_COLOR;
    const fillColor = new Color(color).setAlpha(FILL_COLOR_ALPHA).toHexa();

    const debugActor = actorSpawner.spawn('debugActor');

    const transform = debugActor.getComponent(Transform);

    transform.local.position.x = collider.offset.x;
    transform.local.position.y = collider.offset.y;

    let shape: Shape;

    switch (collider.shape.type) {
      case 'box':
        shape = new Shape({
          type: 'rectangle',
          sizeX: collider.shape.size.x,
          sizeY: collider.shape.size.y,
          strokeColor: color,
          fill: fillColor,
          ...DEFAULT_PROPS,
        });
        break;
      case 'capsule':
        shape = getCapsuleShape(collider, transform, color, fillColor);
        break;
      case 'circle':
        shape = new Shape({
          type: 'circle',
          radius: collider.shape.radius,
          strokeColor: color,
          fill: fillColor,
          ...DEFAULT_PROPS,
        });
        break;
      case 'segment':
        shape = new Shape({
          type: 'line',
          point1X: collider.shape.point1.x,
          point1Y: collider.shape.point1.y,
          point2X: collider.shape.point2.x,
          point2Y: collider.shape.point2.y,
          strokeColor: color,
          ...DEFAULT_PROPS,
        });
        break;
    }

    debugActor.setComponent(shape);

    return debugActor;
  },
  update: (actor, debugActor, options) => {
    const transform = actor.getComponent(Transform);

    const debugTransform = debugActor.getComponent(Transform);
    const debugShape = debugActor.getComponent(Shape);

    if (debugShape.geometry.type === 'circle') {
      const maxScale = Math.max(
        transform.world.scale.x,
        transform.world.scale.y,
      );

      debugTransform.world.scale.x = maxScale;
      debugTransform.world.scale.y = maxScale;
    }

    const zoom = getCurrentZoom(options.world);

    debugShape.strokeWidth = STROKE_WIDTH / zoom;
  },
};
