import { Component } from '../../../engine/component';

interface CameraConfig extends Record<string, unknown> {
  zoom: number;
}

export class Camera extends Component {
  zoom: number;
  windowSizeX: number;
  windowSizeY: number;

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const cameraConfig = config as CameraConfig;

    this.zoom = cameraConfig.zoom;
    this.windowSizeX = 0;
    this.windowSizeY = 0;
  }

  clone(): Camera {
    return new Camera(this.componentName, {
      zoom: this.zoom,
    });
  }
}
