import type { WorldSystemOptions } from '../../../../../engine/system';
import type { World } from '../../../../../engine/world';
import { MouseInput } from '../../../../events';
import type { MouseInputEvent } from '../../../../events';
import { CameraService } from '../../../camera-system';
import { getProjectedX, getProjectedY } from '../../../../utils/coordinates-projection';

export class CoordinatesProjector {
  private world: World;
  private cameraService: CameraService;

  constructor(options: WorldSystemOptions) {
    const { world } = options;

    this.world = world;
    this.cameraService = world.getService(CameraService);

    this.world.addEventListener(MouseInput, this.handleMouseInput);
  }

  destroy(): void {
    this.world.removeEventListener(MouseInput, this.handleMouseInput);
  }

  private handleMouseInput = (event: MouseInputEvent): void => {
    const currentCamera = this.cameraService.getCurrentCamera();

    event.x = currentCamera ? getProjectedX(event.x, currentCamera) : event.x;
    event.y = currentCamera ? getProjectedY(event.y, currentCamera) : event.y;
  };
}
