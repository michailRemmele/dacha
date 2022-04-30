const LISTENING_EVENTS = [
  'onmousedown', 'onmouseup', 'onmousemove', 'onclick', 'oncontextmenu', 'ondblclick',
];

type MouseEventType = 'onmousedown' | 'onmouseup' | 'onmousemove' | 'onclick' | 'oncontextmenu' | 'ondblclick';

export class MouseInputListener {
  private window: Window;
  private firedEvents: Array<MouseEvent>;

  constructor(window: Window) {
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
