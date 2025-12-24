import type { Actor } from '../../engine/actor';
import { Transform, Camera } from '../components';

export const getProjectedX = (inputX: number, camera: Actor): number => {
  const { windowSizeX, zoom } = camera.getComponent(Camera);
  const { world } = camera.getComponent(Transform);

  return ((inputX - (windowSizeX / 2)) / zoom) + world.position.x;
};

export const getProjectedY = (inputY: number, camera: Actor): number => {
  const { windowSizeY, zoom } = camera.getComponent(Camera);
  const { world } = camera.getComponent(Transform);

  return ((inputY - (windowSizeY / 2)) / zoom) + world.position.y;
};
