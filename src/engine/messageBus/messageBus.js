class MessageBus {
  constructor() {
    this._messages = {};
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

  clear() {
    this._messages = {};
  }
}

export default MessageBus;
