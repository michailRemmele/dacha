import { System } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import type { SystemOptions } from '../../../engine/system';
import { ActorCollection } from '../../../engine/actor';
import { Camera } from '../../components/camera';
import { getWindowNode } from '../../utils/get-window-node';
import { SetCamera } from '../../events';
import type { SetCameraEvent } from '../../events';

import { CameraService } from './service';

interface CameraSystemOptions extends SystemOptions {
  windowNodeId: string
}

export class CameraSystem extends System {
  private actorCollection: ActorCollection;
  private scene: Scene;
  private window: Window & HTMLElement;
  private cameraService: CameraService;

  constructor(options: SystemOptions) {
    super();

    const {
      windowNodeId,
      scene,
    } = options as CameraSystemOptions;

    const windowNode = getWindowNode(windowNodeId);

    this.actorCollection = new ActorCollection(scene, {
      components: [
        Camera,
      ],
    });
    this.scene = scene;
    this.window = windowNode as (Window & HTMLElement);

    this.cameraService = new CameraService({
      cameraCollection: this.actorCollection,
      onCameraUpdate: this.handleCameraUpdate,
    });
    scene.addService(this.cameraService);
  }

  mount(): void {
    this.handleCameraUpdate();
    window.addEventListener('resize', this.handleCameraUpdate);
    this.scene.addEventListener(SetCamera, this.handleSetCamera);
  }

  unmount(): void {
    window.removeEventListener('resize', this.handleCameraUpdate);
    this.scene.removeEventListener(SetCamera, this.handleSetCamera);
  }

  /**
   * @deprecated Use CameraService instead
   */
  private handleSetCamera = (event: SetCameraEvent): void => {
    const { actorId } = event;
    const newCamera = this.actorCollection.getById(actorId);

    if (!newCamera) {
      throw new Error(`Could not set camera with id ${actorId} for the scene`);
    }

    this.cameraService.setCurrentCamera(newCamera);
    this.handleCameraUpdate();
  };

  private handleCameraUpdate = (): void => {
    const width = this.window.innerWidth || this.window.clientWidth;
    const height = this.window.innerHeight || this.window.clientHeight;

    const camera = this.cameraService.getCurrentCamera();
    if (!camera) {
      return;
    }

    const cameraComponent = camera.getComponent(Camera);
    const { windowSizeX, windowSizeY } = cameraComponent;

    if (width !== windowSizeX || height !== windowSizeY) {
      cameraComponent.windowSizeX = width;
      cameraComponent.windowSizeY = height;
    }
  };
}

CameraSystem.systemName = 'CameraSystem';
