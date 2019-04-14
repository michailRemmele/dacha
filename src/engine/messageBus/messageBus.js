class MessageBus {
  constructor() {
    this._messages = {};
    this._stashedMessages = [];
  }

  send(message) {
    if (!message.type) {
      throw new Error('Can\'t send the message without specified type');
    }

    this._messages[message.type] = [
      ...(this._messages[message.type] ? this._messages[message.type] : []),
      message,
    ];
  }

  get(messageType) {
    return this._messages[messageType];
  }

  stash() {
    this._stashedMessages.push(this._messages);
    this._messages = {};
  }

  restore() {
    if (this._stashedMessages.length === 0) {
      return;
    }

    this._stashedMessages.push(this._messages);
    this._messages = this._stashedMessages.reduce((storage, messages) => {
      Object.keys(messages).forEach((key) => {
        storage[key] = storage[key] || [];
        storage[key] = storage[key].concat(messages[key]);
      });
      return storage;
    }, {});
    this._stashedMessages = [];
  }

  clear() {
    this._messages = {};
  }
}

export default MessageBus;
