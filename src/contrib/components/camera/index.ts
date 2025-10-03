import { Component } from '../../../engine/component';

export interface CameraConfig {
  zoom: number;
  current: boolean;
}

/**
 * Camera component for defining how a scene should be viewed.
 *
 * Camera component marks an actor as the possible camera to view the scene.
 *
 * @example
 * ```typescript
 * // Create a camera
 * const camera = new Camera({
 *   zoom: 2,
 *   current: true,
 * });
 * ```
 *
 * // Add to actor
 * actor.setComponent(camera);
 * 
 * @category Components
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

  clone(): Camera {
    return new Camera({
      zoom: this.zoom,
      current: this.current,
    });
  }
}

Camera.componentName = 'Camera';
