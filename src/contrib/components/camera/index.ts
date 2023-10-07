import { Component } from '../../../engine/component';

interface CameraConfig extends Record<string, unknown> {
  zoom: number;
}

export class Camera extends Component {
  windowSizeX: number;
  windowSizeY: number;
  screenScale: number;

  private _zoom: number;

  constructor(config: Record<string, unknown>) {
    super();

    const cameraConfig = config as CameraConfig;

    this._zoom = cameraConfig.zoom;
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
