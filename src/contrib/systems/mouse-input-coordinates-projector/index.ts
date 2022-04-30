import type { System, SystemOptions } from '../../../engine/system';
import type { GameObject } from '../../../engine/game-object';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';
import type { Camera } from '../../components/camera';
import type { Transform } from '../../components/transform';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

const CURRENT_CAMERA_NAME = 'currentCamera';
const CAMERA_COMPONENT_NAME = 'camera';
const TRANSFORM_COMPONENT_NAME = 'transform';

interface MouseInputEvent {
  type: string
  x: number
  y: number
  screenX: number
  screenY: number
}

interface InputEventQueryMessage extends Message {
  query: Array<MouseInputEvent>
}

export class MouseInputCoordinatesProjector implements System {
  private messageBus: MessageBus;
  private store: Store;

  constructor(options: SystemOptions) {
    const { store, messageBus } = options;

    this.store = store;
    this.messageBus = messageBus;
  }

  update(): void {
    const currentCamera = this.store.get(CURRENT_CAMERA_NAME) as GameObject;
    const {
      windowSizeX,
      windowSizeY,
      zoom,
    } = currentCamera.getComponent(CAMERA_COMPONENT_NAME) as Camera;
    const windowCenterX = windowSizeX / 2;
    const windowCenterY = windowSizeY / 2;

    const {
      offsetX: cameraOffsetX,
      offsetY: cameraOffsetY,
    } = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;

    const messages = (this.messageBus.get(INPUT_MESSAGE) || []) as Array<InputEventQueryMessage>;
    messages.forEach((message) => {
      message.query.forEach((inputEvent) => {
        inputEvent.screenX = inputEvent.x;
        inputEvent.screenY = inputEvent.y;
        inputEvent.x = ((inputEvent.x - windowCenterX) / zoom) + cameraOffsetX;
        inputEvent.y = ((inputEvent.y - windowCenterY) / zoom) + cameraOffsetY;
      });
    });
  }
}
