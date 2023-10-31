import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { MessageBus } from '../../../engine/message-bus';
import { KEYBOARD_INPUT_MESSAGE } from '../../consts/messages';

import { InputListener } from './input-listener';

export class KeyboardInputSystem extends System {
  private messageBus: MessageBus;
  private inputListener: InputListener;

  constructor(options: SystemOptions) {
    super();

    this.messageBus = options.messageBus;
    this.inputListener = new InputListener(window);
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
