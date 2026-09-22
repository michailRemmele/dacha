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
 * @category Camera
 */
export class CameraAPI {
  private onCameraUpdate: (actor: Actor) => void;
  private findCurrentCamera: () => Actor | undefined;

  /** @internal Created by the system; get the instance from `world.systemApi`. */
  constructor({ onCameraUpdate, findCurrentCamera }: CameraAPIOptions) {
    this.onCameraUpdate = onCameraUpdate;
    this.findCurrentCamera = findCurrentCamera;
  }

  /**
   * Makes the actor the current camera. The game shows the scene through it.
   *
   * @throws Error If the actor has no {@link Camera} component.
   */
  setCurrentCamera(actor: Actor): void {
    if (!actor.getComponent(Camera)) {
      throw new Error(
        `Can't set current camera. Actor with id: ${actor.id} doesn't contain Camera component.`,
      );
    }

    this.onCameraUpdate(actor);
  }

  /** Returns the actor of the current camera, or `undefined` if there is none. */
  getCurrentCamera(): Actor | undefined {
    return this.findCurrentCamera();
  }
}
