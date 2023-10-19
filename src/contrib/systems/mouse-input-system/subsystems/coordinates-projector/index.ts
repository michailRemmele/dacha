import type { SystemOptions } from '../../../../../engine/system';
import type { GameObject } from '../../../../../engine/game-object';
import type { MessageBus } from '../../../../../engine/message-bus';
import type { Store } from '../../../../../engine/scene';
import { Camera, Transform } from '../../../../components';
import { MOUSE_INPUT_MESSAGE } from '../../../../consts/messages';
import type { MouseInputMessage } from '../../../../types/messages';

const CURRENT_CAMERA_NAME = 'currentCamera';

export class CoordinatesProjector {
  private messageBus: MessageBus;
  private store: Store;

  constructor(options: SystemOptions) {
    const { store, messageBus } = options;

    this.store = store;
    this.messageBus = messageBus;
  }

  private getProjectedX(inputX: number): number {
    const currentCamera = this.store.get(CURRENT_CAMERA_NAME) as GameObject | undefined;

    if (currentCamera === undefined) {
      return inputX;
    }

    const { windowSizeX, zoom } = currentCamera.getComponent(Camera);
    const { offsetX: cameraOffsetX } = currentCamera.getComponent(Transform);

    return ((inputX - (windowSizeX / 2)) / zoom) + cameraOffsetX;
  }

  private getProjectedY(inputY: number): number {
    const currentCamera = this.store.get(CURRENT_CAMERA_NAME) as GameObject | undefined;

    if (currentCamera === undefined) {
      return inputY;
    }

    const { windowSizeY, zoom } = currentCamera.getComponent(Camera);
    const { offsetY: cameraOffsetY } = currentCamera.getComponent(Transform);

    return ((inputY - (windowSizeY / 2)) / zoom) + cameraOffsetY;
  }

  update(): void {
    const messages = this.messageBus.get(
      MOUSE_INPUT_MESSAGE,
    ) as Array<MouseInputMessage> | undefined;
    messages?.forEach((message) => {
      message.x = this.getProjectedX(message.x);
      message.y = this.getProjectedY(message.y);
    });
  }
}
