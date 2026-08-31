import type { CustomKeyboardEvent } from '../../types/input-events';

export class InputListener {
  private windowNode: Window | HTMLElement;
  private eventsQuery: CustomKeyboardEvent[];

  constructor(window: Window | HTMLElement) {
    this.windowNode = window;
    this.eventsQuery = [];
  }

  handleKeyDown = (event: Event): void => {
    this.eventsQuery.push({
      key: (event as KeyboardEvent).code,
      pressed: true,
      nativeEvent: event as KeyboardEvent,
    });
  };

  handleKeyUp = (event: Event): void => {
    this.eventsQuery.push({
      key: (event as KeyboardEvent).code,
      pressed: false,
      nativeEvent: event as KeyboardEvent,
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

  getEvents(): CustomKeyboardEvent[] {
    return this.eventsQuery;
  }

  clear(): void {
    this.eventsQuery = [];
  }
}
