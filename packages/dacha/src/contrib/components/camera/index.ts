import { Component } from '../../../engine/component';
import { DefineComponent, DefineField } from '../../../engine/decorators';

/**
 * Options for {@link Camera}.
 *
 * @category Camera
 */
export interface CameraConfig {
  zoom: number;
  current: boolean;
}

/**
 * Makes an actor a camera. The game shows the scene through the current camera.
 *
 * @see [Camera](https://dachajs.org/systems/camera/)
 *
 * @category Camera
 */
@DefineComponent({ name: 'Camera', icon: 'Video' })
export class Camera extends Component<CameraConfig> {
  /** Zoom of the camera */
  @DefineField({ initialValue: 1 })
  zoom!: number;
  /** Whether the camera is the current camera. Only one camera can be the current camera. */
  @DefineField({ initialValue: false })
  current!: boolean;

  /** Size of the game window on the x axis, in pixels */
  windowSizeX = 0;
  /** Size of the game window on the y axis, in pixels */
  windowSizeY = 0;
}
