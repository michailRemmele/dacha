import Processor from 'engine/processor/processor';

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

class MouseInputProcessor extends Processor {
  constructor() {
    super();

    this._inputListener = new MouseInputListener(window);
  }

  processorDidMount() {
    this._inputListener.startListen();
  }

  processorWillUnmount() {
    this._inputListener.stopListen();
  }

  process(options) {
    const messageBus = options.messageBus;

    const firedEvents = this._inputListener.getFiredEvents() || [];
    const inputQuery = firedEvents.map((event) => {
      return {
        type: EVENT_TYPE[event.type](event),
        x: event.clientX,
        y: event.clientY,
      };
    });
    this._inputListener.clearFiredEvents();

    messageBus.send({
      type: INPUT_MESSAGE,
      query: inputQuery,
    });
  }
}

export default MouseInputProcessor;
