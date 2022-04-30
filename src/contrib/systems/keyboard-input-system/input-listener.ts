export class InputListener {
  private window: Window;
  private pressedKeys: Set<number>;
  private releasedKeys: Set<number>;

  constructor(window: Window) {
    this.window = window;
    this.pressedKeys = new Set();
    this.releasedKeys = new Set();
  }

  startListen(): void {
    this.window.onkeydown = (event): void => {
      this.pressedKeys.add(event.keyCode);
    };

    this.window.onkeyup = (event): void => {
      this.pressedKeys.delete(event.keyCode);
      this.releasedKeys.add(event.keyCode);
    };
  }

  stopListen(): void {
    this.window.onkeydown = null;
  }

  getPressedKeys(): Array<number> {
    return Array.from(this.pressedKeys);
  }

  getReleasedKeys(): Array<number> {
    return Array.from(this.releasedKeys);
  }

  clearPressedKeys(): void {
    this.pressedKeys.clear();
  }

  clearReleasedKeys(): void {
    this.releasedKeys.clear();
  }
}
