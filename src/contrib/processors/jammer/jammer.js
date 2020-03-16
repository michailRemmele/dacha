import Processor from 'engine/processor/processor';

class Jammer extends Processor {
  constructor(options) {
    super();

    this._messages = options.messages;
  }

  process(options) {
    const messageBus = options.messageBus;

    this._messages.forEach((message) => {
      messageBus.delete(message);
    });
  }
}

export default Jammer;
