import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { MessageBus } from '../../../engine/message-bus';

import { InputListener } from './input-listener';
import { KeyCodeMapper } from './key-code-mapper';

const INPUT_MESSAGE = 'INPUT_EVENT_QUERY';

const PRESS_EVENT_TYPE = 'PRESSED';
const RELEASE_EVENT_TYPE = 'RELEASED';

const PREFIX_SEPARATOR = '_';

interface KeyboardInputEvent {
  type: 'PRESSED' | 'RELEASED'
  getKeys: () => Array<number>
  onProcessComplete: () => void
}

export class KeyboardInputSystem extends System {
  private messageBus: MessageBus;
  private inputListener: InputListener;
  private keyCodeMapper: KeyCodeMapper;
  private events: Array<KeyboardInputEvent>;

  constructor(options: SystemOptions) {
    super();

    this.messageBus = options.messageBus;
    this.inputListener = new InputListener(window);
    this.keyCodeMapper = new KeyCodeMapper();

    this.events = [
      {
        type: PRESS_EVENT_TYPE,
        getKeys: (): Array<number> => this.inputListener.getPressedKeys(),
        onProcessComplete: (): void => this.inputListener.clearPressedKeys(),
      },
      {
        type: RELEASE_EVENT_TYPE,
        getKeys: (): Array<number> => this.inputListener.getReleasedKeys(),
        onProcessComplete: (): void => this.inputListener.clearReleasedKeys(),
      },
    ];
  }

  mount(): void {
    this.inputListener.startListen();
  }

  unmount(): void {
    this.inputListener.stopListen();
  }

  update(): void {
    const eventQuery: Array<string> = [];

    this.events.forEach((event) => {
      event.getKeys().forEach((keyCode) => {
        eventQuery.push(`${this.keyCodeMapper.getChar(keyCode)}${PREFIX_SEPARATOR}${event.type}`);
      });

      event.onProcessComplete();
    });

    this.messageBus.send({
      type: INPUT_MESSAGE,
      query: eventQuery,
    });
  }
}

KeyboardInputSystem.systemName = 'KeyboardInputSystem';
