import Processor from 'engine/processor/processor';

import Observer from './observer/observer';

class UiBridge extends Processor {
  constructor(options) {
    super();

    const { onInit, onDestroy, sceneController } = options;

    this._onUiInit = onInit;
    this._onUiDestroy = onDestroy;
    this._sceneController = sceneController;
    this._messageBusObserver = new Observer();
  }

  processorDidMount() {
    this._onUiInit({
      sceneName: this._sceneController.getCurrentName(),
      messageBusObserver: this._messageBusObserver,
    });
  }

  processorWillUnmount() {
    this._onUiDestroy();
  }

  process(options) {
    const { messageBus } = options;

    this._messageBusObserver.next(messageBus);
  }
}

export default UiBridge;
