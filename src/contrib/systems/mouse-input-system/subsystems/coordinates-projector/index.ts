import type { SystemOptions } from '../../../../../engine/system';
import type { GameObject } from '../../../../../engine/game-object';
import type { MessageBus } from '../../../../../engine/message-bus';
import { Camera, Transform } from '../../../../components';
import { MOUSE_INPUT_MESSAGE } from '../../../../consts/messages';
import type { MouseInputMessage } from '../../../../types/messages';
import { CameraService } from '../../../camera-system';

export class CoordinatesProjector {
  private messageBus: MessageBus;
  private cameraService: CameraService;

  constructor(options: SystemOptions) {
    const { messageBus, sceneContext } = options;

    this.messageBus = messageBus;
    this.cameraService = sceneContext.getService(CameraService);
  }

  private getProjectedX(inputX: number, camera: GameObject): number {
    const { windowSizeX, zoom } = camera.getComponent(Camera);
    const { offsetX: cameraOffsetX } = camera.getComponent(Transform);

    return ((inputX - (windowSizeX / 2)) / zoom) + cameraOffsetX;
  }

  private getProjectedY(inputY: number, camera: GameObject): number {
    const { windowSizeY, zoom } = camera.getComponent(Camera);
    const { offsetY: cameraOffsetY } = camera.getComponent(Transform);

    return ((inputY - (windowSizeY / 2)) / zoom) + cameraOffsetY;
  }

  update(): void {
    const currentCamera = this.cameraService.getCurrentCamera();

    const messages = this.messageBus.get(
      MOUSE_INPUT_MESSAGE,
    ) as Array<MouseInputMessage> | undefined;
    messages?.forEach((message) => {
      message.x = this.getProjectedX(message.x, currentCamera);
      message.y = this.getProjectedY(message.y, currentCamera);
    });
  }
}
