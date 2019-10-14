import Processor from 'engine/processor/processor';

class Reaper extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const messageBus = options.messageBus;
  }
}

export default Reaper;
