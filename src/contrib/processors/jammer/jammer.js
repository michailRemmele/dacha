class Jammer {
  constructor(options) {
    this._messages = options.messages;
    this.messageBus = options.messageBus;
  }

  process() {
    this._messages.forEach((message) => {
      this.messageBus.delete(message);
    });
  }
}

export default Jammer;
