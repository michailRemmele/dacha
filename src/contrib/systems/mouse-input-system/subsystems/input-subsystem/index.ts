import type { SystemOptions } from '../../../../../engine/system';
import type { MessageBus } from '../../../../../engine/message-bus';
import { MOUSE_INPUT_MESSAGE } from '../../../../consts/messages';
import type { MouseInputMessage } from '../../../../types/messages';

import { MouseInputListener } from './mouse-input-listener';

interface InputSubsystemOptions extends SystemOptions {
  windowNodeId?: string;
}

export class InputSubsystem {
  private messageBus: MessageBus;
  private inputListener: MouseInputListener;

  constructor(options: SystemOptions) {
    const { messageBus, windowNodeId } = options as InputSubsystemOptions;

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
