import { Component } from '../../../engine/component';

interface CameraConfig {
  zoom: number;
}

export class Camera extends Component {
  zoom: number;
  windowSizeX: number;
  windowSizeY: number;

  constructor(componentName: string, config: CameraConfig) {
    super(componentName);

    this.zoom = config.zoom;
    this.windowSizeX = 0;
    this.windowSizeY = 0;
  }

  clone() {
    return new Camera(this.componentName, {
      zoom: this.zoom,
    });
  }
}

export default Camera;
