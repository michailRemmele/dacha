class InputListener {
  constructor(window) {
    this._window = window;
    this._pressedKeys = new Set();
    this._releasedKeys = new Set();
  }

  startListen(keys) {
    this._window.onkeydown = (event) => {
      if (keys.indexOf(event.keyCode) !== -1) {
        this._pressedKeys.add(event.keyCode);
      }
    };

    this._window.onkeyup = (event) => {
      if (keys.indexOf(event.keyCode) !== -1) {
        this._pressedKeys.delete(event.keyCode);
        this._releasedKeys.add(event.keyCode);
      }
    };
  }

  stopListen() {
    this._window.onkeydown = null;
  }

  getPressedKeys() {
    return Array.from(this._pressedKeys);
  }

  getReleasedKeys() {
    return Array.from(this._releasedKeys);
  }

  clearPressedKeys() {
    this._pressedKeys.clear();
  }

  clearReleasedKeys() {
    this._releasedKeys.clear();
  }
}

export default InputListener;
