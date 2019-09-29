import Component from 'engine/component/component';

class Camera extends Component {
  constructor(config) {
    super();

    this._windowSizeX = 0;
    this._windowSizeY = 0;
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
    return new Camera({});
  }
}

export default Camera;
