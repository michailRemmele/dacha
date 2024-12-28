import type { Actor, ActorCollection } from '../../../engine/actor';
import { Camera } from '../../components';

interface CameraServiceOptions {
  cameraCollection: ActorCollection
  onCameraUpdate: () => void
}

export class CameraService {
  private cameraCollection: ActorCollection;
  private onCameraUpdate: () => void;

  constructor({ cameraCollection, onCameraUpdate }: CameraServiceOptions) {
    this.cameraCollection = cameraCollection;
    this.onCameraUpdate = onCameraUpdate;
  }

  setCurrentCamera(actor: Actor): void {
    if (!actor.getComponent(Camera)) {
      throw new Error(`Can't set current camera. Actor with id: ${actor.id} doesn't contain Camera component.`);
    }

    this.cameraCollection.forEach((cameraActor) => {
      const camera = cameraActor.getComponent(Camera);
      camera.current = actor.id === cameraActor.id;
    });

    this.onCameraUpdate();
  }

  getCurrentCamera(): Actor | undefined {
    return this.cameraCollection.find((actor) => {
      const camera = actor.getComponent(Camera);
      return camera.current;
    });
  }
}
