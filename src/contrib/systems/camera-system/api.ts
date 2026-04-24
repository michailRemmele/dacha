import type { Actor } from '../../../engine/actor';
import { Camera } from '../../components';

interface CameraAPIOptions {
  onCameraUpdate: (actor: Actor) => void;
  findCurrentCamera: () => Actor | undefined;
}

/**
 * API that manages camera control and current camera tracking
 *
 * Provides methods to set and get the current camera actor
 *
 * @category Systems
 */
export class CameraAPI {
  private onCameraUpdate: (actor: Actor) => void;
  private findCurrentCamera: () => Actor | undefined;

  constructor({ onCameraUpdate, findCurrentCamera }: CameraAPIOptions) {
    this.onCameraUpdate = onCameraUpdate;
    this.findCurrentCamera = findCurrentCamera;
  }

  setCurrentCamera(actor: Actor): void {
    if (!actor.getComponent(Camera)) {
      throw new Error(
        `Can't set current camera. Actor with id: ${actor.id} doesn't contain Camera component.`,
      );
    }

    this.onCameraUpdate(actor);
  }

  getCurrentCamera(): Actor | undefined {
    return this.findCurrentCamera();
  }
}
