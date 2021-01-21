class MessageConditionProps {
  constructor(config) {
    this._message = config.message;
  }

  set message(message) {
    this._message = message;
  }

  get message() {
    return this._message;
  }
}

export default MessageConditionProps;
