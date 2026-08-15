import { Camera, CameraAPI, type World } from 'dacha';

export const getCurrentZoom = (world: World): number => {
  const cameraApi = world.systemApi.get(CameraAPI);
  const cameraActor = cameraApi.getCurrentCamera();
  const camera = cameraActor?.getComponent(Camera);

  return camera?.zoom ?? 1;
};
