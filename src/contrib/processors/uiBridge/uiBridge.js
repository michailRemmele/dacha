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

    this._messageQueue = [];
  }

  processorDidMount() {
    this._onUiInit({
      sceneName: this._sceneController.getCurrentName(),
      messageBusObserver: this._messageBusObserver,
      pushMessage: this._pushMessage.bind(this),
    });
  }

  processorWillUnmount() {
    this._onUiDestroy();
  }

  _pushMessage(message) {
    this._messageQueue.push(message);
  }

  process(options) {
    const { messageBus } = options;

    this._messageBusObserver.next(messageBus);

    this._messageQueue.forEach((message) => {
      messageBus.send(message, true);
    });

    this._messageQueue = [];
  }
}

export default UiBridge;
