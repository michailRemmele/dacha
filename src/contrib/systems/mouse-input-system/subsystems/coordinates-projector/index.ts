import type { SystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { Camera, Transform } from '../../../../components';
import { MouseInput } from '../../../../events';
import type { MouseInputEvent } from '../../../../events';
import { CameraService } from '../../../camera-system';

export class CoordinatesProjector {
  private scene: Scene;
  private cameraService: CameraService;

  constructor(options: SystemOptions) {
    const { scene } = options;

    this.scene = scene;
    this.cameraService = scene.getService(CameraService);
  }

  mount(): void {
    this.scene.addEventListener(MouseInput, this.handleMouseInput);
  }

  unmount(): void {
    this.scene.removeEventListener(MouseInput, this.handleMouseInput);
  }

  private getProjectedX(inputX: number, camera: Actor): number {
    const { windowSizeX, zoom } = camera.getComponent(Camera);
    const { offsetX: cameraOffsetX } = camera.getComponent(Transform);

    return ((inputX - (windowSizeX / 2)) / zoom) + cameraOffsetX;
  }

  private getProjectedY(inputY: number, camera: Actor): number {
    const { windowSizeY, zoom } = camera.getComponent(Camera);
    const { offsetY: cameraOffsetY } = camera.getComponent(Transform);

    return ((inputY - (windowSizeY / 2)) / zoom) + cameraOffsetY;
  }

  private handleMouseInput = (event: MouseInputEvent): void => {
    const currentCamera = this.cameraService.getCurrentCamera();

    event.x = this.getProjectedX(event.x, currentCamera);
    event.y = this.getProjectedY(event.y, currentCamera);
  };
}
