import type { Actor } from '../../engine/actor';
import { Transform, Camera } from '../components';

export const getProjectedX = (inputX: number, camera: Actor): number => {
  const { windowSizeX, zoom } = camera.getComponent(Camera);
  const { offsetX: cameraOffsetX } = camera.getComponent(Transform);

  return ((inputX - (windowSizeX / 2)) / zoom) + cameraOffsetX;
};

export const getProjectedY = (inputY: number, camera: Actor): number => {
  const { windowSizeY, zoom } = camera.getComponent(Camera);
  const { offsetY: cameraOffsetY } = camera.getComponent(Transform);

  return ((inputY - (windowSizeY / 2)) / zoom) + cameraOffsetY;
};
