import type { System, SystemOptions } from '../../../engine/system';
import type { EntityObserver } from '../../../engine/entity';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { MouseControl } from '../../components/mouse-control';

const CONTROL_COMPONENT_NAME = 'mouseControl';

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
  private entityObserver: EntityObserver;
  private messageBus: MessageBus;

  constructor(options: SystemOptions) {
    this.entityObserver = options.createEntityObserver({
      components: [
        CONTROL_COMPONENT_NAME,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update(): void {
    const messages = (this.messageBus.get(INPUT_MESSAGE) || []) as Array<InputEventQueryMessage>;
    messages.forEach((message) => {
      message.query.forEach((inputEvent) => {
        this.entityObserver.forEach((entity) => {
          const control = entity.getComponent(CONTROL_COMPONENT_NAME) as MouseControl;
          const eventBinding = control.inputEventBindings[inputEvent.type];

          if (eventBinding) {
            if (!eventBinding.messageType) {
              throw new Error(`The message type not specified for input event: ${inputEvent.type}`);
            }

            this.messageBus.send({
              type: eventBinding.messageType,
              ...eventBinding.attrs,
              entity,
              id: entity.getId(),
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
