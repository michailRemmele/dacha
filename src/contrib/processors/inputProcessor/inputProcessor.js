import Processor from 'engine/processor/processor';

import InputListener from './inputListener';
import ActionResolver from './actionResolver';

const PRESS_EVENT_TYPE = 'PRESS';
const RELEASE_EVENT_TYPE = 'RELEASE';
const PREFIX_SEPARATOR = '_';

class InputProcessor extends Processor {
  constructor(keyBindings) {
    super();

    this._keyBindings = keyBindings;
    this._inputListener = new InputListener(window);
    this._actionResolver = new ActionResolver(this._keyBindings);

    this._events = [
      {
        type: PRESS_EVENT_TYPE,
        getKeys: () => this._inputListener.getPressedKeys(),
        onProcessComplete: () => {},
      },
      {
        type: RELEASE_EVENT_TYPE,
        getKeys: () => this._inputListener.getReleasedKeys(),
        onProcessComplete: () => this._inputListener.clearReleasedKeys(),
      },
    ];
  }

  processorDidMount() {
    this._inputListener.startListen(this._actionResolver.getKeys());
  }

  processorWillUnmount() {
    this._inputListener.stopListen();
  }

  process(options) {
    const messageBus = options.messageBus;

    this._events.forEach((event) => {
      event.getKeys().forEach((key) => {
        const action = this._actionResolver.resolve(key);

        if (action) {
          messageBus.send({
            type: `${event.type}${PREFIX_SEPARATOR}${action}`,
          });
        }
      });

      event.onProcessComplete();
    });
  }
}

export default InputProcessor;
