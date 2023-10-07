import type { System, SystemOptions } from '../../../engine/system';
import type { GameObject } from '../../../engine/game-object';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';
import { Camera } from '../../components/camera';
import { Transform } from '../../components/transform';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

const CURRENT_CAMERA_NAME = 'currentCamera';

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
    } = currentCamera.getComponent(Camera);
    const windowCenterX = windowSizeX / 2;
    const windowCenterY = windowSizeY / 2;

    const {
      offsetX: cameraOffsetX,
      offsetY: cameraOffsetY,
    } = currentCamera.getComponent(Transform);

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
