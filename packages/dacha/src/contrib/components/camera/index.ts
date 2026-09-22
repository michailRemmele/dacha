import { Component } from '../../../engine/component';

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
export class Camera extends Component {
  /** Zoom of the camera */
  zoom: number;
  /** Whether the camera is the current camera. Only one camera can be the current camera. */
  current: boolean;

  /** Size of the game window in the x axis in pixels */
  windowSizeX: number;
  /** Size of the game window in the y axis in pixels */
  windowSizeY: number;

  constructor(config: CameraConfig) {
    super();

    this.current = config.current;
    this.zoom = config.zoom;

    this.windowSizeX = 0;
    this.windowSizeY = 0;
  }
}

Camera.componentName = 'Camera';
