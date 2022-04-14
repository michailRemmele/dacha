const CONTROL_COMPONENT_NAME = 'mouseControl';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

export class MouseControlSystem {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
    this.messageBus = options.messageBus;
  }

  update() {
    const messages = this.messageBus.get(INPUT_MESSAGE) || [];
    messages.forEach((message) => {
      message.query.forEach((inputEvent) => {
        this._gameObjectObserver.forEach((gameObject) => {
          const control = gameObject.getComponent(CONTROL_COMPONENT_NAME);
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
