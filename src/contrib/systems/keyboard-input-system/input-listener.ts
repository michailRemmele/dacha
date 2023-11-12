import type { KeyboardInputEvent } from '../../types/messages';

export class InputListener {
  private windowNode: Window | HTMLElement;
  private eventsQuery: Array<KeyboardInputEvent>;

  constructor(window: Window | HTMLElement) {
    this.windowNode = window;
    this.eventsQuery = [];
  }

  handleKeyDown = (event: Event): void => {
    this.eventsQuery.push({
      key: (event as KeyboardEvent).code,
      pressed: true,
    });
  };

  handleKeyUp = (event: Event): void => {
    this.eventsQuery.push({
      key: (event as KeyboardEvent).code,
      pressed: false,
    });
  };

  startListen(): void {
    this.windowNode.addEventListener('keydown', this.handleKeyDown);
    this.windowNode.addEventListener('keyup', this.handleKeyUp);
  }

  stopListen(): void {
    this.windowNode.removeEventListener('keydown', this.handleKeyDown);
    this.windowNode.removeEventListener('keyup', this.handleKeyUp);
  }

  getEvents(): Array<KeyboardInputEvent> {
    return this.eventsQuery;
  }

  clear(): void {
    this.eventsQuery = [];
  }
}
