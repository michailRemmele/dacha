const LISTENING_EVENTS = [
  'onmousedown',
  'onmouseup',
  'onmousemove',
  'onclick',
  'oncontextmenu',
  'ondblclick',
  'onmouseenter',
  'onmouseleave',
];

type MouseEventType =
  'onmousedown' |
  'onmouseup' |
  'onmousemove' |
  'onclick' |
  'oncontextmenu' |
  'ondblclick' |
  'onmouseenter' |
  'onmouseleave';

export class MouseInputListener {
  private window: GlobalEventHandlers;
  private firedEvents: Array<MouseEvent>;

  constructor(window: GlobalEventHandlers) {
    this.window = window;
    this.firedEvents = [];
  }

  startListen(): void {
    LISTENING_EVENTS.forEach((listeningEvent) => {
      this.window[listeningEvent as MouseEventType] = (event): void => {
        this.firedEvents.push(event);
      };
    });
  }

  stopListen(): void {
    LISTENING_EVENTS.forEach((event) => {
      this.window[event as MouseEventType] = null;
    });
  }

  getFiredEvents(): Array<MouseEvent> {
    return this.firedEvents;
  }

  clearFiredEvents(): void {
    this.firedEvents = [];
  }
}
