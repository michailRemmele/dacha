import {
  Transform,
  Shape,
  Actor,
  Camera,
  CameraService,
  type World,
} from 'dacha';
import { type Bounds } from 'dacha/renderer';

import { getIdByPath } from '../../../utils/get-id-by-path';

import type { SelectionArea } from './types';
import {
  SCENE_PATH_LEGTH,
  FRAME_STROKE_WIDTH,
  AREA_STROKE_WIDTH,
} from './consts';

const accumulatePath = (actor: Actor, path: string[]): void => {
  path.unshift(`id:${actor.id}`);

  if (actor.parent instanceof Actor) {
    path.unshift('children');
    accumulatePath(actor.parent, path);
  }
};

export const buildActorPath = (actor: Actor, sceneId: string): string[] => {
  const path: string[] = [];

  accumulatePath(actor, path);
  path.unshift('scenes', `id:${sceneId}`, 'actors');

  return path;
};

export const updateFrameSize = (
  frame: Actor,
  actor: Actor,
  bounds: Bounds,
  zoom: number,
): void => {
  const frameTransform = frame.getComponent(Transform);
  const frameShape = frame.getComponent(Shape);

  const actorTransform = actor.getComponent(Transform);

  frameTransform.offsetX = actorTransform.offsetX;
  frameTransform.offsetY = actorTransform.offsetY;
  frameShape.width = bounds.width;
  frameShape.height = bounds.height;
  frameShape.strokeWidth = FRAME_STROKE_WIDTH / zoom;
};

export const updateAreaSize = (
  selectionArea: SelectionArea,
  zoom: number,
): void => {
  const { sceneSize, area } = selectionArea;

  const transform = area.getComponent(Transform);
  const shape = area.getComponent(Shape);

  transform.offsetX = (sceneSize.x0 + sceneSize.x1) / 2;
  transform.offsetY = (sceneSize.y0 + sceneSize.y1) / 2;
  shape.width = Math.abs(sceneSize.x0 - sceneSize.x1);
  shape.height = Math.abs(sceneSize.y0 - sceneSize.y1);
  shape.strokeWidth = AREA_STROKE_WIDTH / zoom;
};

export const getActorIdByPath = (
  path: string[],
  currentSceneId: string | undefined,
): string | undefined => {
  if (!currentSceneId) {
    return undefined;
  }

  if (
    path !== undefined &&
    path[0] === 'scenes' &&
    path.length > SCENE_PATH_LEGTH
  ) {
    const sceneId = getIdByPath([path[1]]);

    if (sceneId !== currentSceneId) {
      return undefined;
    }

    return getIdByPath(path);
  }
  return undefined;
};

export const getCurrentZoom = (world: World): number => {
  const cameraService = world.getService(CameraService);
  const cameraActor = cameraService.getCurrentCamera();
  const camera = cameraActor?.getComponent(Camera);

  return camera?.zoom ?? 1;
};
