import type { System, SystemOptions } from '../../../engine/system';
import type { GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus, Message } from '../../../engine/message-bus';
import { MouseControl } from '../../components/mouse-control';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

interface MouseInputEvent {
  type: string
  x: number
  y: number
  screenX: number
  screenY: number
}

interface InputEventQueryMessage extends Message {
  query: Array<MouseInputEvent>
}

export class MouseControlSystem implements System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;

  constructor(options: SystemOptions) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        MouseControl,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update(): void {
    const messages = (this.messageBus.get(INPUT_MESSAGE) || []) as Array<InputEventQueryMessage>;
    messages.forEach((message) => {
      message.query.forEach((inputEvent) => {
        this.gameObjectObserver.forEach((gameObject) => {
          const control = gameObject.getComponent(MouseControl);
          const eventBinding = control.inputEventBindings[inputEvent.type];

          if (eventBinding) {
            if (!eventBinding.messageType) {
              throw new Error(`The message type not specified for input event: ${inputEvent.type}`);
            }

            this.messageBus.send({
              type: eventBinding.messageType,
              ...eventBinding.attrs,
              gameObject,
              id: gameObject.getId(),
              x: inputEvent.x,
              y: inputEvent.y,
              screenX: inputEvent.screenX,
              screenY: inputEvent.screenY,
            });
          }
        });
      });
    });
  }
}
