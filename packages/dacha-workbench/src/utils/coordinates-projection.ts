import { Transform, Camera, type Actor } from 'dacha';

export const getProjectedX = (inputX: number, camera: Actor): number => {
  const { windowSizeX, zoom } = camera.getComponent(Camera);
  const {
    world: { position },
  } = camera.getComponent(Transform);

  return (inputX - windowSizeX / 2) / zoom + position.x;
};

export const getProjectedY = (inputY: number, camera: Actor): number => {
  const { windowSizeY, zoom } = camera.getComponent(Camera);
  const {
    world: { position },
  } = camera.getComponent(Transform);

  return (inputY - windowSizeY / 2) / zoom + position.y;
};
