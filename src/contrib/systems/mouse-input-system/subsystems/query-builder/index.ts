import type { SystemOptions } from '../../../../../engine/system';
import type { MessageBus } from '../../../../../engine/message-bus';
import { MOUSE_INPUT_MESSAGE } from '../../../../consts/messages';
import type { MouseInputMessage } from '../../../../types/messages';

import { MouseInputListener } from './mouse-input-listener';

interface QueryBuilderOptions extends SystemOptions {
  windowNodeId?: string;
}

export class QueryBuilder {
  private messageBus: MessageBus;
  private inputListener: MouseInputListener;

  constructor(options: SystemOptions) {
    const { messageBus, windowNodeId } = options as QueryBuilderOptions;

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
    this.inputListener.getFiredEvents().forEach((inputEvent) => {
      this.messageBus.send({
        type: MOUSE_INPUT_MESSAGE,
        ...inputEvent,
      } as MouseInputMessage);
    });
    this.inputListener.clearFiredEvents();
  }
}
