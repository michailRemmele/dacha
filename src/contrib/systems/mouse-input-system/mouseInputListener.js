const LISTENING_EVENTS = [
  'onmousedown', 'onmouseup', 'onmousemove', 'onclick', 'oncontextmenu', 'ondblclick',
];

class MouseInputListener {
  constructor(window) {
    this._window = window;
    this._firedEvents = [];
  }

  startListen() {
    LISTENING_EVENTS.forEach((listeningEvent) => {
      this._window[listeningEvent] = (event) => {
        this._firedEvents.push(event);
      };
    });
  }

  stopListen() {
    LISTENING_EVENTS.forEach((event) => {
      this._window[event] = null;
    });
  }

  getFiredEvents() {
    return this._firedEvents;
  }

  clearFiredEvents() {
    this._firedEvents = [];
  }
}

export default MouseInputListener;
