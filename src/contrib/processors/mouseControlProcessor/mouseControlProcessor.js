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

          if (control.inputEventBindings[inputEvent.type]) {
            messageBus.send({
              type: control.inputEventBindings[inputEvent.type],
              gameObject: gameObject,
              screenX: inputEvent.x,
              screenY: inputEvent.y,
            });
          }
        });
      });
    });
  }
}

export default MouseControlProcessor;
