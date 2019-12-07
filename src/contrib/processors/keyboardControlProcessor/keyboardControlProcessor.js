import Processor from 'engine/processor/processor';

const CONTROL_COMPONENT_NAME = 'keyboardControl';

const INPUT_MESSAGE = 'INPUT_EVENT_QUERY';

const RELEASE_EVENT_TYPE = 'RELEASED';

const PREFIX_SEPARATOR = '_';

class KeyboardControlProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const messageBus = options.messageBus;

    this._gameObjectObserver.forEach((gameObject) => {
      const control = gameObject.getComponent(CONTROL_COMPONENT_NAME);

      const messages = messageBus.get(INPUT_MESSAGE) || [];
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
          `${key}${PREFIX_SEPARATOR}${inputEventType}`
        ];

        if (inputEventType && eventBinding) {
          if (!eventBinding.messageType) {
            throw new Error(`The message type not specified for input event: ${inputEventType}`);
          }

          messageBus.send({
            type: eventBinding.messageType,
            ...eventBinding.attrs,
            gameObject: gameObject,
            id: gameObject.getId(),
          });
        }
        if (inputEventType === RELEASE_EVENT_TYPE) {
          control.keyStates[key] = null;
        }
      });
    });
  }
}

export default KeyboardControlProcessor;
