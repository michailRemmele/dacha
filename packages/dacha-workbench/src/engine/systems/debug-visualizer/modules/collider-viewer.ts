import { Collider, Shape, Transform } from 'dacha';
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
  sortCenter: [0, 0] as Shape['sortCenter'],
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

    transform.local.position.x = collider.centerX;
    transform.local.position.y = collider.centerY;

    let shape: Shape;

    switch (collider.type) {
      case 'box':
        shape = new Shape({
          type: 'rectangle',
          width: collider.sizeX ?? 0,
          height: collider.sizeY ?? 0,
          strokeColor: color,
          fill: fillColor,
          ...DEFAULT_PROPS,
        });
        break;
      case 'circle':
        shape = new Shape({
          type: 'circle',
          radius: collider.radius ?? 0,
          strokeColor: color,
          fill: fillColor,
          ...DEFAULT_PROPS,
        });
        break;
      case 'segment':
        shape = new Shape({
          type: 'line',
          point1X: collider.point1?.x ?? 0,
          point1Y: collider.point1?.y ?? 0,
          point2X: collider.point2?.x ?? 0,
          point2Y: collider.point2?.y ?? 0,
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

    if (debugShape.type === 'circle') {
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
