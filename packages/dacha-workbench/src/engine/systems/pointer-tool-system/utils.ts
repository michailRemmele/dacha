import {
  Transform,
  Shape,
  Actor,
  RendererAPI,
  type RectangleShapeGeometry,
  type World,
} from 'dacha';
import { type Bounds } from 'dacha/renderer';

import { Technical } from '../../components';
import { DebugVisualizerAPI } from '../../systems';
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
  bounds: Bounds,
  zoom: number,
): void => {
  const transform = frame.getComponent(Transform);
  const shape = frame.getComponent(Shape);
  const shapeGeometry = shape.geometry as RectangleShapeGeometry;

  transform.world.position.x = (bounds.minX + bounds.maxX) / 2;
  transform.world.position.y = (bounds.minY + bounds.maxY) / 2;
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

const findSelectableActor = (actor: Actor): Actor | undefined => {
  const technical = actor.getComponent(Technical);

  if (!technical) {
    return actor;
  }

  return technical.source;
};

export const getSelectableActors = (actors: Actor[]): Actor[] => {
  const selection = new Set<Actor>();

  actors.forEach((actor) => {
    const selectableActor = findSelectableActor(actor);

    if (selectableActor) {
      selection.add(selectableActor);
    }
  });

  return Array.from(selection);
};

export const findDebugBounds = (actor: Actor, world: World): Bounds | null => {
  const debugVisualizerApi = world.systemApi.get(DebugVisualizerAPI);
  const rendererApi = world.systemApi.get(RendererAPI);

  const debugActors = debugVisualizerApi.getDebugActors(actor);

  const maxBounds: Bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
    width: 0,
    height: 0,
  };

  while (debugActors.length > 0) {
    const debugActor = debugActors.pop()!;

    const bounds = rendererApi.getBounds(debugActor);

    if (bounds) {
      maxBounds.minX = Math.min(maxBounds.minX, bounds.minX);
      maxBounds.minY = Math.min(maxBounds.minY, bounds.minY);
      maxBounds.maxX = Math.max(maxBounds.maxX, bounds.maxX);
      maxBounds.maxY = Math.max(maxBounds.maxY, bounds.maxY);
    }

    debugActors.push(...debugActor.children);
  }

  if (maxBounds.minX === Infinity) {
    return null;
  }

  maxBounds.width = maxBounds.maxX - maxBounds.minX;
  maxBounds.height = maxBounds.maxY - maxBounds.minY;

  return maxBounds;
};
