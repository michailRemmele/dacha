import type { System, SystemOptions } from '../../../engine/system';
import type { MessageBus } from '../../../engine/message-bus';

import { MouseInputListener } from './mouse-input-listener';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

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
};

export class MouseInputSystem implements System {
  private messageBus: MessageBus;
  private inputListener: MouseInputListener;

  constructor(options: SystemOptions) {
    this.messageBus = options.messageBus;
    this.inputListener = new MouseInputListener(window);
  }

  mount(): void {
    this.inputListener.startListen();
  }

  unmount(): void {
    this.inputListener.stopListen();
  }

  update(): void {
    const firedEvents = this.inputListener.getFiredEvents() || [];
    const inputQuery = firedEvents.map((event) => ({
      type: EVENT_TYPE[event.type](event),
      x: event.clientX,
      y: event.clientY,
    }));
    this.inputListener.clearFiredEvents();

    this.messageBus.send({
      type: INPUT_MESSAGE,
      query: inputQuery,
    });
  }
}
