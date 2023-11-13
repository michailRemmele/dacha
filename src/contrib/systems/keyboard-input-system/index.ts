import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { MessageBus } from '../../../engine/message-bus';
import { KEYBOARD_INPUT_MESSAGE } from '../../consts/messages';
import { getWindowNode } from '../../utils/get-window-node';

import { InputListener } from './input-listener';

interface KeyboardInputSystemOptions extends SystemOptions {
  windowNodeId?: string
  useWindow: boolean
}

export class KeyboardInputSystem extends System {
  private messageBus: MessageBus;
  private inputListener: InputListener;

  constructor(options: SystemOptions) {
    super();

    const {
      messageBus,
      windowNodeId,
      useWindow,
    } = options as KeyboardInputSystemOptions;

    this.messageBus = messageBus;

    const windowNode = useWindow ? window : getWindowNode(windowNodeId as string);

    this.inputListener = new InputListener(windowNode);
  }

  mount(): void {
    this.inputListener.startListen();
  }

  unmount(): void {
    this.inputListener.stopListen();
  }

  update(): void {
    this.inputListener.getEvents().forEach((event) => {
      this.messageBus.send({
        type: KEYBOARD_INPUT_MESSAGE,
        ...event,
      });
    });

    this.inputListener.clear();
  }
}

KeyboardInputSystem.systemName = 'KeyboardInputSystem';
