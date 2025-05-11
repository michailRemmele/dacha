import { WorldSystem } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import type { WorldSystemOptions } from '../../../engine/system';
import { ActorCollection } from '../../../engine/actor';
import type { Actor } from '../../../engine/actor';
import { Camera } from '../../components/camera';
import { getWindowNode } from '../../utils/get-window-node';

import { CameraService } from './service';

interface CameraSystemOptions extends WorldSystemOptions {
  windowNodeId: string
}

export class CameraSystem extends WorldSystem {
  private actorCollection?: ActorCollection;
  private window: Window & HTMLElement;
  private cameraService: CameraService;

  constructor(options: WorldSystemOptions) {
    super();

    const {
      windowNodeId,
      world,
    } = options as CameraSystemOptions;

    const windowNode = getWindowNode(windowNodeId);

    this.window = windowNode as (Window & HTMLElement);

    this.cameraService = new CameraService({
      onCameraUpdate: this.handleCameraUpdate,
      findCurrentCamera: this.findCurrentCamera,
    });
    world.addService(this.cameraService);

    window.addEventListener('resize', this.handleWindowResize);
  }

  onSceneEnter(scene: Scene): void {
    this.actorCollection = new ActorCollection(scene, {
      components: [Camera],
    });

    this.handleWindowResize();
  }

  onSceneExit(): void {
    this.actorCollection = undefined;
  }

  onWorldDestroy(): void {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  private handleWindowResize = (): void => {
    const width = this.window.innerWidth || this.window.clientWidth;
    const height = this.window.innerHeight || this.window.clientHeight;

    const camera = this.findCurrentCamera();
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

  private handleCameraUpdate = (actor: Actor): void => {
    this.actorCollection?.forEach((cameraActor) => {
      const camera = cameraActor.getComponent(Camera);
      camera.current = actor.id === cameraActor.id;
    });

    this.handleWindowResize();
  };

  private findCurrentCamera = (): Actor | undefined => {
    return this.actorCollection?.find((actor) => {
      const camera = actor.getComponent(Camera);
      return camera.current;
    });
  };
}

CameraSystem.systemName = 'CameraSystem';
