export class Jammer {
  constructor(options) {
    this._messages = options.messages;
    this.messageBus = options.messageBus;
  }

  update() {
    this._messages.forEach((message) => {
      this.messageBus.delete(message);
    });
  }
}
