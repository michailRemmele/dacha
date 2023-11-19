import type { GameObject } from '../../../engine/game-object';

interface CameraServiceOptions {
  camera: GameObject
}

export class CameraService {
  private camera: GameObject;

  constructor({ camera }: CameraServiceOptions) {
    this.camera = camera;
  }

  setCurrentCamera(camera: GameObject): void {
    this.camera = camera;
  }

  getCurrentCamera(): GameObject {
    return this.camera;
  }
}
