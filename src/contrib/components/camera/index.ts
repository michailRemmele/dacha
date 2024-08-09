import { Component } from '../../../engine/component';

export interface CameraConfig {
  zoom: number;
}

export class Camera extends Component {
  windowSizeX: number;
  windowSizeY: number;
  screenScale: number;

  private _zoom: number;

  constructor(config: CameraConfig) {
    super();

    this._zoom = config.zoom;
    this.windowSizeX = 0;
    this.windowSizeY = 0;

    this.screenScale = 1;
  }

  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom * this.screenScale;
  }

  clone(): Camera {
    return new Camera({
      zoom: this.zoom,
    });
  }
}

Camera.componentName = 'Camera';
