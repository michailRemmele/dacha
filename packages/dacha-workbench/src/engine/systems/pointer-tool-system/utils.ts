import { Transform, Shape, Actor, type RectangleShapeGeometry } from 'dacha';
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
  const transform = frame.getComponent(Transform);
  const shape = frame.getComponent(Shape);
  const shapeGeometry = shape.geometry as RectangleShapeGeometry;

  const actorTransform = actor.getComponent(Transform);

  transform.world.position.x = actorTransform.world.position.x;
  transform.world.position.y = actorTransform.world.position.y;
  shapeGeometry.size.x = bounds.width;
  shapeGeometry.size.y = bounds.height;
  shape.strokeWidth = FRAME_STROKE_WIDTH / zoom;
};

export const updateAreaSize = (
  selectionArea: SelectionArea,
  zoom: number,
): void => {
  const { sceneSize, area } = selectionArea;

  const transform = area.getComponent(Transform);
  const shape = area.getComponent(Shape);
  const shapeGeometry = shape.geometry as RectangleShapeGeometry;

  transform.world.position.x = (sceneSize.x0 + sceneSize.x1) / 2;
  transform.world.position.y = (sceneSize.y0 + sceneSize.y1) / 2;
  shapeGeometry.size.x = Math.abs(sceneSize.x0 - sceneSize.x1);
  shapeGeometry.size.y = Math.abs(sceneSize.y0 - sceneSize.y1);
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
