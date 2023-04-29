const BUTTON_TYPE: Record<number, string> = {
  1: 'LEFT',
  2: 'MIDDLE',
  3: 'RIGHT',
};

const EVENT_TYPE: Record<string, (event: MouseEvent) => string> = {
  mousedown: (event): string => `MOUSE_${BUTTON_TYPE[event.which]}_BUTTON_PRESS`,
  mouseup: (event): string => `MOUSE_${BUTTON_TYPE[event.which]}_BUTTON_RELEASE`,
  mousemove: (): string => 'MOUSE_MOVE',
  click: (): string => 'MOUSE_LEFT_BUTTON_CLICK',
  contextmenu: (): string => 'MOUSE_RIGHT_BUTTON_CLICK',
  dblclick: (): string => 'MOUSE_DOUBLE_CLICK',
  mouseenter: (): string => 'MOUSE_ENTER',
  mouseleave: (): string => 'MOUSE_LEAVE',
};

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

interface MouseInputEvent {
  type: string
  x: number
  y: number
}

export class MouseInputListener {
  private window: GlobalEventHandlers;
  private firedEvents: Array<MouseInputEvent>;

  constructor(window: GlobalEventHandlers) {
    this.window = window;
    this.firedEvents = [];
  }

  startListen(): void {
    LISTENING_EVENTS.forEach((listeningEvent) => {
      this.window[listeningEvent as MouseEventType] = (event): void => {
        this.firedEvents.push({
          type: EVENT_TYPE[event.type](event),
          x: event.offsetX,
          y: event.offsetY,
        });
      };
    });
  }

  stopListen(): void {
    LISTENING_EVENTS.forEach((event) => {
      this.window[event as MouseEventType] = null;
    });
  }

  getFiredEvents(): Array<MouseInputEvent> {
    return this.firedEvents;
  }

  clearFiredEvents(): void {
    this.firedEvents = [];
  }
}
