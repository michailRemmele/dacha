import type { System, SystemOptions } from '../../../engine/system';
import type { Entity, EntityObserver } from '../../../engine/entity';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';
import type { Camera } from '../../components/camera';

const CURRENT_CAMERA_NAME = 'currentCamera';
const SET_CAMERA_MESSAGE = 'SET_CAMERA';

const CAMERA_COMPONENT_NAME = 'camera';

interface SetCameraMessage extends Message {
  entityId: string
}

interface CameraSystemOptions extends SystemOptions {
  initialCamera: string;
  windowNodeId: string;
}

export class CameraSystem implements System {
  private entityObserver: EntityObserver;
  private messageBus: MessageBus;
  private store: Store;
  private window: Window & HTMLElement;

  constructor(options: CameraSystemOptions) {
    const {
      initialCamera,
      windowNodeId,
      createEntityObserver,
      store,
      messageBus,
    } = options;

    const windowNode = document.getElementById(windowNodeId) || window;

    this.entityObserver = createEntityObserver({
      components: [
        CAMERA_COMPONENT_NAME,
      ],
    });
    this.messageBus = messageBus;
    this.store = store;
    this.window = windowNode as (Window & HTMLElement);

    const currentCamera = this.entityObserver.getById(initialCamera);

    if (!currentCamera) {
      throw new Error(`Could not set camera with id ${initialCamera} for the scene`);
    }

    this.setCamera(currentCamera);
  }

  mount(): void {
    this.updateCameraWindowSize();
    window.addEventListener('resize', this.updateCameraWindowSize);
  }

  unmount(): void {
    window.removeEventListener('resize', this.updateCameraWindowSize);
  }

  private updateCameraWindowSize = (): void => {
    const camera = this.store.get(CURRENT_CAMERA_NAME) as Entity;

    const width = this.window.innerWidth || this.window.clientWidth;
    const height = this.window.innerHeight || this.window.clientHeight;

    const cameraComponent = camera.getComponent(CAMERA_COMPONENT_NAME) as Camera;
    const { windowSizeX, windowSizeY } = cameraComponent;

    if (width !== windowSizeX || height !== windowSizeY) {
      cameraComponent.windowSizeX = width;
      cameraComponent.windowSizeY = height;
    }
  };

  private setCamera(camera: Entity): void {
    this.store.set(CURRENT_CAMERA_NAME, camera);
    this.updateCameraWindowSize();
  }

  update(): void {
    const messages = this.messageBus.get(SET_CAMERA_MESSAGE);
    if (messages) {
      const { entityId } = messages[messages.length - 1] as SetCameraMessage;
      const newCamera = this.entityObserver.getById(entityId);

      if (!newCamera) {
        throw new Error(`Could not set camera with id ${entityId} for the scene`);
      }

      this.setCamera(newCamera);
    }
  }
}
