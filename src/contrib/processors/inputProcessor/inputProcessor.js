import Processor from 'engine/processor/processor';

import InputListener from './inputListener';
import ActionResolver from './actionResolver';

class InputProcessor extends Processor {
  constructor(keyBindings) {
    super();

    this._keyBindings = keyBindings;
    this._inputListener = new InputListener(window);
    this._actionResolver = new ActionResolver(this._keyBindings);
  }

  processorDidMount() {
    this._inputListener.startListen(this._actionResolver.getKeys());
  }

  processorWillUnmount() {
    this._inputListener.stopListen();
  }

  process(options) {
    const messageBus = options.messageBus;

    this._inputListener.getQueue().forEach((key) => {
      const action = this._actionResolver.resolve(key);

      if (action) {
        messageBus.send({
          type: action,
        });
      }
    });
    this._inputListener.clearQueue();
  }
}

export default InputProcessor;
