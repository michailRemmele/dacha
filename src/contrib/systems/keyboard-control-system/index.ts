import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus } from '../../../engine/message-bus';
import { KeyboardControl } from '../../components/keyboard-control';
import type { KeyboardEventBind } from '../../components/keyboard-control';
import { KEYBOARD_INPUT_MESSAGE } from '../../consts/messages';
import type { KeyboardInputMessage } from '../../types/messages';

export class KeyboardControlSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;

  private pressedKeys: Set<string>;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        KeyboardControl,
      ],
    });
    this.messageBus = options.messageBus;

    this.pressedKeys = new Set();
  }

  private sendMessage(gameObject: GameObject, eventBinding: KeyboardEventBind, code: string): void {
    if (!eventBinding.messageType) {
      throw new Error(`The message type is not specified for input key: ${code}`);
    }

    this.messageBus.send({
      type: eventBinding.messageType,
      ...eventBinding.attrs,
      gameObject,
      id: gameObject.getId(),
    });
  }

  update(): void {
    const messages = this.messageBus.get(
      KEYBOARD_INPUT_MESSAGE,
    ) as Array<KeyboardInputMessage> | undefined;

    messages?.forEach((message) => {
      if (!message.pressed) {
        this.pressedKeys.delete(message.key);
      }
    });

    this.gameObjectObserver.forEach((gameObject) => {
      const control = gameObject.getComponent(KeyboardControl);

      // Resend control message when key is pressed without actual event if keepEmit is set to true
      this.pressedKeys.forEach((key) => {
        const inputBinding = control.inputEventBindings[key]?.pressed;
        if (inputBinding !== undefined && inputBinding.keepEmit) {
          this.sendMessage(gameObject, inputBinding, key);
        }
      });

      // Send control message on input event excluding repeated browser generated key pressed events
      messages?.forEach((message) => {
        const { key, pressed } = message;
        const inputBinding = control.inputEventBindings[key]?.[pressed ? 'pressed' : 'released'];
        if (inputBinding !== undefined && !this.pressedKeys.has(key)) {
          this.sendMessage(gameObject, inputBinding, key);
        }
      });
    });

    messages?.forEach((message) => {
      if (message.pressed) {
        this.pressedKeys.add(message.key);
      } else {
        this.pressedKeys.delete(message.key);
      }
    });
  }
}

KeyboardControlSystem.systemName = 'KeyboardControlSystem';
