import type { SystemOptions } from '../../../../../engine/system';
import type { Scene } from '../../../../../engine/scene';
import { MouseInput } from '../../../../events';
import type { MouseInputEvent } from '../../../../events';
import { CameraService } from '../../../camera-system';
import { getProjectedX, getProjectedY } from '../../../../utils/coordinates-projection';

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

  private handleMouseInput = (event: MouseInputEvent): void => {
    const currentCamera = this.cameraService.getCurrentCamera();

    event.x = currentCamera ? getProjectedX(event.x, currentCamera) : event.x;
    event.y = currentCamera ? getProjectedY(event.y, currentCamera) : event.y;
  };
}
