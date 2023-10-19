import { System } from '../../../engine/system';
import type { SystemOptions } from '../../../engine/system';
import type { GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus } from '../../../engine/message-bus';
import { MouseControl } from '../../components/mouse-control';
import { MOUSE_INPUT_MESSAGE } from '../../consts/messages';
import type { MouseInputMessage } from '../../types/messages';

export class MouseControlSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        MouseControl,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update(): void {
    const messages = this.messageBus.get(
      MOUSE_INPUT_MESSAGE,
    ) as Array<MouseInputMessage> | undefined;
    messages?.forEach((message) => {
      this.gameObjectObserver.forEach((gameObject) => {
        const control = gameObject.getComponent(MouseControl);
        const eventBinding = control.inputEventBindings[message.eventType];

        if (eventBinding) {
          if (!eventBinding.messageType) {
            throw new Error(`The message type not specified for input event: ${message.eventType}`);
          }

          this.messageBus.send({
            type: eventBinding.messageType,
            ...eventBinding.attrs,
            gameObject,
            id: gameObject.getId(),
            x: message.x,
            y: message.y,
            screenX: message.screenX,
            screenY: message.screenY,
          });
        }
      });
    });
  }
}

MouseControlSystem.systemName = 'MouseControlSystem';
