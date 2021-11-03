import { Component } from '../../../engine/component';

interface CameraConfig {
  zoom: number;
}

export class Camera extends Component {
  private _zoom: number;
  private _windowSizeX: number;
  private _windowSizeY: number;

  constructor(componentName: string, config: CameraConfig) {
    super(componentName);

    this._zoom = config.zoom;
    this._windowSizeX = 0;
    this._windowSizeY = 0;
  }

  set zoom(zoom) {
    this._zoom = zoom;
  }

  get zoom() {
    return this._zoom;
  }

  set windowSizeX(windowSizeX) {
    this._windowSizeX = windowSizeX;
  }

  get windowSizeX() {
    return this._windowSizeX;
  }

  set windowSizeY(windowSizeY) {
    this._windowSizeY = windowSizeY;
  }

  get windowSizeY() {
    return this._windowSizeY;
  }

  clone() {
    return new Camera(this.componentName, {
      zoom: this.zoom,
    });
  }
}

export default Camera;
