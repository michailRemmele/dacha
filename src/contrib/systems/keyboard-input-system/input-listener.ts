import type { KeyboardInputEvent } from '../../types/messages';

export class InputListener {
  private window: Window;
  private eventsQuery: Array<KeyboardInputEvent>;

  constructor(window: Window) {
    this.window = window;
    this.eventsQuery = [];
  }

  startListen(): void {
    this.window.onkeydown = (event): void => {
      this.eventsQuery.push({
        key: event.code,
        pressed: true,
      });
    };

    this.window.onkeyup = (event): void => {
      this.eventsQuery.push({
        key: event.code,
        pressed: false,
      });
    };
  }

  stopListen(): void {
    this.window.onkeydown = null;
    this.window.onkeyup = null;
  }

  getEvents(): Array<KeyboardInputEvent> {
    return this.eventsQuery;
  }

  clear(): void {
    this.eventsQuery = [];
  }
}
