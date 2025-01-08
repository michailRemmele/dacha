import type { CustomMouseEvent } from '../../../../types/input-events';

const LISTENING_EVENTS = [
  'mousedown',
  'mouseup',
  'mousemove',
  'click',
  'contextmenu',
  'dblclick',
  'mouseenter',
  'mouseleave',
] as const;

export class MouseInputListener {
  private window: Window | HTMLElement;
  private firedEvents: Array<CustomMouseEvent>;

  constructor(window: Window | HTMLElement) {
    this.window = window;
    this.firedEvents = [];
  }

  handleMouseEvent = (event: Event): void => {
    const {
      type, button, offsetX, offsetY,
    } = event as MouseEvent;

    this.firedEvents.push({
      eventType: type,
      button,
      x: offsetX,
      y: offsetY,
      screenX: offsetX,
      screenY: offsetY,
      nativeEvent: event as MouseEvent,
    });
  };

  startListen(): void {
    LISTENING_EVENTS.forEach((eventType) => {
      this.window.addEventListener(eventType, this.handleMouseEvent);
    });
  }

  stopListen(): void {
    LISTENING_EVENTS.forEach((eventType) => {
      this.window.removeEventListener(eventType, this.handleMouseEvent);
    });
  }

  getFiredEvents(): Array<CustomMouseEvent> {
    return this.firedEvents;
  }

  clearFiredEvents(): void {
    this.firedEvents = [];
  }
}
