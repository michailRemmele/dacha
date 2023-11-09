import type { MouseInputEvent } from '../../../../types/messages';

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
  private window: GlobalEventHandlers;
  private firedEvents: Array<MouseInputEvent>;

  constructor(window: GlobalEventHandlers) {
    this.window = window;
    this.firedEvents = [];
  }

  handleMouseEvent = (event: MouseEvent): void => {
    this.firedEvents.push({
      eventType: event.type,
      button: event.button,
      x: event.offsetX,
      y: event.offsetY,
      screenX: event.offsetX,
      screenY: event.offsetY,
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

  getFiredEvents(): Array<MouseInputEvent> {
    return this.firedEvents;
  }

  clearFiredEvents(): void {
    this.firedEvents = [];
  }
}
