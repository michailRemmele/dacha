import Processor from 'engine/processor/processor';

const CONTROL_COMPONENT_NAME = 'mouseControl';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

class MouseControlProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const messageBus = options.messageBus;

    const messages = messageBus.get(INPUT_MESSAGE) || [];
    messages.forEach((message) => {
      message.query.forEach((inputEvent) => {
        this._gameObjectObserver.forEach((gameObject) => {
          const control = gameObject.getComponent(CONTROL_COMPONENT_NAME);
          const eventBinding = control.inputEventBindings[inputEvent.type];

          if (eventBinding) {
            if (!eventBinding.messageType) {
              throw new Error(`The message type not specified for input event: ${inputEvent.type}`);
            }

            messageBus.send({
              type: eventBinding.messageType,
              ...eventBinding.attrs,
              gameObject: gameObject,
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

export default MouseControlProcessor;
