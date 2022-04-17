import MouseInputListener from './mouseInputListener';

const INPUT_MESSAGE = 'MOUSE_INPUT_EVENT_QUERY';

const BUTTON_TYPE = {
  1: 'LEFT',
  2: 'MIDDLE',
  3: 'RIGHT',
};

const EVENT_TYPE = {
  mousedown: (event) => `MOUSE_${BUTTON_TYPE[event.which]}_BUTTON_PRESS`,
  mouseup: (event) => `MOUSE_${BUTTON_TYPE[event.which]}_BUTTON_RELEASE`,
  mousemove: () => 'MOUSE_MOVE',
  click: () => 'MOUSE_LEFT_BUTTON_CLICK',
  contextmenu: () => 'MOUSE_RIGHT_BUTTON_CLICK',
  dblclick: () => 'MOUSE_DOUBLE_CLICK',
};

export class MouseInputSystem {
  constructor(options) {
    this.messageBus = options.messageBus;
    this._inputListener = new MouseInputListener(window);
  }

  systemDidMount() {
    this._inputListener.startListen();
  }

  systemWillUnmount() {
    this._inputListener.stopListen();
  }

  update() {
    const firedEvents = this._inputListener.getFiredEvents() || [];
    const inputQuery = firedEvents.map((event) => ({
      type: EVENT_TYPE[event.type](event),
      x: event.clientX,
      y: event.clientY,
    }));
    this._inputListener.clearFiredEvents();

    this.messageBus.send({
      type: INPUT_MESSAGE,
      query: inputQuery,
    });
  }
}
