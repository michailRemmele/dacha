import { Sprite, Transform } from 'dacha';

import { MARKERS } from '../../../../consts/markers';
import { getCurrentZoom } from '../../../../utils/get-current-zoom';
import { EditorMarker, Technical } from '../../../components';
import type { DebugViewModule } from '../types';

const BASE_SCALE = 2;

export const markerViewer: DebugViewModule = {
  id: 'marker-viewer',
  title: 'Markers',
  validate: (actor): boolean => Boolean(actor.getComponent(EditorMarker)),
  build: (actor, options) => {
    const { actorSpawner } = options;

    const editorMarker = actor.getComponent(EditorMarker);

    const debugActor = actorSpawner.spawn('debugActor');

    const sprite = new Sprite({
      src: '/images/editor-marker-icons.png',
      slice: 10,
      width: 16,
      height: 16,
      flipX: false,
      flipY: false,
      sortingLayer: 'editor-layer-0',
      sortOffsetX: 0,
      sortOffsetY: 0,
      fit: 'stretch',
      color: editorMarker.color,
      blending: 'normal',
      opacity: 1,
      disabled: false,
    });
    sprite.currentFrame = MARKERS.indexOf(editorMarker.name);

    debugActor.setComponent(sprite);

    const technical = debugActor.getComponent(Technical);
    technical.source = actor;

    return debugActor;
  },
  update: (actor, debugActor, options) => {
    const transform = actor.getComponent(Transform);
    const debugTransform = debugActor.getComponent(Transform);

    debugTransform.world.position.x = transform.world.position.x;
    debugTransform.world.position.y = transform.world.position.y;

    const zoom = getCurrentZoom(options.world);

    const scale = BASE_SCALE / zoom;
    debugTransform.world.scale.x = scale;
    debugTransform.world.scale.y = scale;
  },
};
