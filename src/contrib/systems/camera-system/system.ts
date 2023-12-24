import { MathOps } from '../../../engine/mathLib';
import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { Message, MessageEmitter } from '../../../engine/message-bus';
import { Camera } from '../../components/camera';
import { getWindowNode } from '../../utils/get-window-node';

import { CameraService } from './service';

const SET_CAMERA_MESSAGE = 'SET_CAMERA';

export const STD_SCREEN_SIZE = 1080;

interface SetCameraMessage extends Message {
  gameObjectId: string
}

interface CameraSystemOptions extends SystemOptions {
  initialCamera: string
  windowNodeId: string
  scaleSensitivity: number
}

export class CameraSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private messageEmitter: MessageEmitter;
  private window: Window & HTMLElement;
  private scaleSensitivity: number;
  private cameraService: CameraService;

  constructor(options: SystemOptions) {
    super();

    const {
      initialCamera,
      windowNodeId,
      scaleSensitivity,
      createGameObjectObserver,
      messageEmitter,
      sceneContext,
    } = options as CameraSystemOptions;

    const windowNode = getWindowNode(windowNodeId);

    this.gameObjectObserver = createGameObjectObserver({
      components: [
        Camera,
      ],
    });
    this.messageEmitter = messageEmitter;
    this.window = windowNode as (Window & HTMLElement);

    this.scaleSensitivity = MathOps.clamp(scaleSensitivity, 0, 1);

    const currentCamera = this.gameObjectObserver.getById(initialCamera);

    if (!currentCamera) {
      throw new Error(`Could not set camera with id ${initialCamera} for the scene`);
    }

    this.cameraService = new CameraService({ camera: currentCamera });
    sceneContext.registerService(this.cameraService);

    this.setCamera(currentCamera);
  }

  mount(): void {
    this.handleCameraUpdate();
    window.addEventListener('resize', this.handleCameraUpdate);
    this.messageEmitter.on(SET_CAMERA_MESSAGE, this.handleSetCameraMessage);
  }

  unmount(): void {
    window.removeEventListener('resize', this.handleCameraUpdate);
    this.messageEmitter.off(SET_CAMERA_MESSAGE, this.handleSetCameraMessage);
  }

  private handleSetCameraMessage = (message: unknown): void => {
    const { gameObjectId } = message as SetCameraMessage;
    const newCamera = this.gameObjectObserver.getById(gameObjectId);

    if (!newCamera) {
      throw new Error(`Could not set camera with id ${gameObjectId} for the scene`);
    }

    this.setCamera(newCamera);
  };

  private handleCameraUpdate = (): void => {
    const width = this.window.innerWidth || this.window.clientWidth;
    const height = this.window.innerHeight || this.window.clientHeight;

    this.updateCameraWindowSize(width, height);
    this.updateScreenScale(width, height);
  };

  private updateCameraWindowSize(width: number, height: number): void {
    const camera = this.cameraService.getCurrentCamera();

    const cameraComponent = camera.getComponent(Camera);
    const { windowSizeX, windowSizeY } = cameraComponent;

    if (width !== windowSizeX || height !== windowSizeY) {
      cameraComponent.windowSizeX = width;
      cameraComponent.windowSizeY = height;
    }
  }

  private updateScreenScale(width: number, height: number): void {
    const screenSize = Math.sqrt(width ** 2 + height ** 2);
    const avaragingValue = 1 - this.scaleSensitivity;
    const normalizedSize = screenSize - ((screenSize - STD_SCREEN_SIZE) * avaragingValue);

    const camera = this.cameraService.getCurrentCamera();
    const cameraComponent = camera.getComponent(Camera);

    cameraComponent.screenScale = normalizedSize / STD_SCREEN_SIZE;
  }

  private setCamera(camera: GameObject): void {
    this.cameraService.setCurrentCamera(camera);
    this.handleCameraUpdate();
  }
}

CameraSystem.systemName = 'CameraSystem';
