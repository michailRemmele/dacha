import type { System, SystemOptions } from '../../../engine/system';
import type { EntityObserver } from '../../../engine/entity';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { KeyboardControl } from '../../components/keyboard-control';

const CONTROL_COMPONENT_NAME = 'keyboardControl';

const INPUT_MESSAGE = 'INPUT_EVENT_QUERY';

const RELEASE_EVENT_TYPE = 'RELEASED';

const PREFIX_SEPARATOR = '_';

interface InputEventQueryMessage extends Message {
  query: Array<string>
}

export class KeyboardControlSystem implements System {
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
    this.entityObserver.forEach((entity) => {
      const control = entity.getComponent(CONTROL_COMPONENT_NAME) as KeyboardControl;

      const messages = (this.messageBus.get(INPUT_MESSAGE) || []) as Array<InputEventQueryMessage>;
      messages.forEach((message) => {
        message.query.forEach((inputEvent) => {
          const splitEvent = inputEvent.split(PREFIX_SEPARATOR);
          const key = splitEvent[0];
          const eventType = splitEvent[1];

          if (key in control.keyStates) {
            control.keyStates[key] = eventType;
          }
        });
      });

      Object.keys(control.keyStates).forEach((key) => {
        const inputEventType = control.keyStates[key];
        const eventBinding = control.inputEventBindings[
          `${key}${PREFIX_SEPARATOR}${inputEventType as string}`
        ];

        if (inputEventType && eventBinding) {
          if (!eventBinding.messageType) {
            throw new Error(`The message type not specified for input event: ${inputEventType}`);
          }

          this.messageBus.send({
            type: eventBinding.messageType,
            ...eventBinding.attrs,
            entity,
            id: entity.getId(),
          });
        }
        if (inputEventType === RELEASE_EVENT_TYPE) {
          control.keyStates[key] = null;
        }
      });
    });
  }
}
