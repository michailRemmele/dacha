class Jammer {
  constructor(options) {
    this._messages = options.messages;
  }

  process(options) {
    const { messageBus } = options;

    this._messages.forEach((message) => {
      messageBus.delete(message);
    });
  }
}

export default Jammer;
