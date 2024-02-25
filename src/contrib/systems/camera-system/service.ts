import type { Actor } from '../../../engine/actor';

interface CameraServiceOptions {
  camera: Actor
}

export class CameraService {
  private camera: Actor;

  constructor({ camera }: CameraServiceOptions) {
    this.camera = camera;
  }

  setCurrentCamera(camera: Actor): void {
    this.camera = camera;
  }

  getCurrentCamera(): Actor {
    return this.camera;
  }
}
