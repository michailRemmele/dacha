import { Component } from '../../../engine/component';

export interface CameraConfig {
  zoom: number
  current: boolean
}

export class Camera extends Component {
  zoom: number;
  current: boolean;

  windowSizeX: number;
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
