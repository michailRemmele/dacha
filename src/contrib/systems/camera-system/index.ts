import { MathOps } from '../../../engine/mathLib';
import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';
import { Camera } from '../../components/camera';

const CURRENT_CAMERA_NAME = 'currentCamera';
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
  private messageBus: MessageBus;
  private store: Store;
  private window: Window & HTMLElement;
  private scaleSensitivity: number;

  constructor(options: SystemOptions) {
    super();

    const {
      initialCamera,
      windowNodeId,
      scaleSensitivity,
      createGameObjectObserver,
      store,
      messageBus,
    } = options as CameraSystemOptions;

    const windowNode = document.getElementById(windowNodeId) || window;

    this.gameObjectObserver = createGameObjectObserver({
      components: [
        Camera,
      ],
    });
    this.messageBus = messageBus;
    this.store = store;
    this.window = windowNode as (Window & HTMLElement);

    this.scaleSensitivity = MathOps.clamp(scaleSensitivity, 0, 1);

    const currentCamera = this.gameObjectObserver.getById(initialCamera);

    if (!currentCamera) {
      throw new Error(`Could not set camera with id ${initialCamera} for the scene`);
    }

    this.setCamera(currentCamera);
  }

  mount(): void {
    this.handleCameraUpdate();
    window.addEventListener('resize', this.handleCameraUpdate);
  }

  unmount(): void {
    window.removeEventListener('resize', this.handleCameraUpdate);
  }

  private handleCameraUpdate = (): void => {
    const width = this.window.innerWidth || this.window.clientWidth;
    const height = this.window.innerHeight || this.window.clientHeight;

    this.updateCameraWindowSize(width, height);
    this.updateScreenScale(width, height);
  };

  private updateCameraWindowSize(width: number, height: number): void {
    const camera = this.store.get(CURRENT_CAMERA_NAME) as GameObject;

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

    const camera = this.store.get(CURRENT_CAMERA_NAME) as GameObject;
    const cameraComponent = camera.getComponent(Camera);

    cameraComponent.screenScale = normalizedSize / STD_SCREEN_SIZE;
  }

  private setCamera(camera: GameObject): void {
    this.store.set(CURRENT_CAMERA_NAME, camera);
    this.handleCameraUpdate();
  }

  update(): void {
    const messages = this.messageBus.get(SET_CAMERA_MESSAGE);
    if (messages) {
      const { gameObjectId } = messages[messages.length - 1] as SetCameraMessage;
      const newCamera = this.gameObjectObserver.getById(gameObjectId);

      if (!newCamera) {
        throw new Error(`Could not set camera with id ${gameObjectId} for the scene`);
      }

      this.setCamera(newCamera);
    }
  }
}

CameraSystem.systemName = 'CameraSystem';
