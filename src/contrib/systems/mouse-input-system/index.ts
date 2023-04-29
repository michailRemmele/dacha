import type { System, SystemOptions } from '../../../engine/system';
import type { MessageBus } from '../../../engine/message-bus';

import { MouseInputListener } from './mouse-input-listener';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

interface MouseInputSystemOptions extends SystemOptions {
  windowNodeId?: string;
}

export class MouseInputSystem implements System {
  private messageBus: MessageBus;
  private inputListener: MouseInputListener;

  constructor(options: SystemOptions) {
    const { messageBus, windowNodeId } = options as MouseInputSystemOptions;

    this.messageBus = messageBus;

    let windowNode: GlobalEventHandlers = window;
    if (windowNodeId) {
      windowNode = document.getElementById(windowNodeId) || windowNode;
    }

    this.inputListener = new MouseInputListener(windowNode);
  }

  mount(): void {
    this.inputListener.startListen();
  }

  unmount(): void {
    this.inputListener.stopListen();
  }

  update(): void {
    this.messageBus.send({
      type: INPUT_MESSAGE,
      query: this.inputListener.getFiredEvents() || [],
    });
    this.inputListener.clearFiredEvents();
  }
}
