import type { Actor } from '../../../engine/actor';
import { Camera } from '../../components';

interface CameraServiceOptions {
  onCameraUpdate: (actor: Actor) => void
  findCurrentCamera: () => Actor | undefined
}

export class CameraService {
  private onCameraUpdate: (actor: Actor) => void;
  private findCurrentCamera: () => Actor | undefined;

  constructor({ onCameraUpdate, findCurrentCamera }: CameraServiceOptions) {
    this.onCameraUpdate = onCameraUpdate;
    this.findCurrentCamera = findCurrentCamera;
  }

  setCurrentCamera(actor: Actor): void {
    if (!actor.getComponent(Camera)) {
      throw new Error(`Can't set current camera. Actor with id: ${actor.id} doesn't contain Camera component.`);
    }

    this.onCameraUpdate(actor);
  }

  getCurrentCamera(): Actor | undefined {
    return this.findCurrentCamera();
  }
}
