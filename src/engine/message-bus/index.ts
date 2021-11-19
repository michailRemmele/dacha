export interface Message {
  type: string;
  id?: string;
  [key: string]: unknown;
}

interface MessagesSection {
  array: Array<Message>;
  map: Record<string, Array<Message> | undefined>;
}

export class MessageBus {
  private _messages: Record<string, MessagesSection | undefined>;
  private _delayedMessages: Array<Message>;

  constructor() {
    this._messages = {};
    this._delayedMessages = [];
  }

  send(message: Message, delay = false) {
    if (!message.type) {
      throw new Error('Can\'t send the message without specified type');
    }

    if (delay) {
      this._delayedMessages.push(message);
      return;
    }

    const { type, id } = message;

    const messagesSection = this._messages[type] || { array: [], map: {} };
    this._messages[type] = messagesSection;

    if (id) {
      const sectionMapItem = messagesSection.map[id] || [];
      messagesSection.map[id] = sectionMapItem;

      sectionMapItem.push(message);
    }

    messagesSection.array.push(message);
  }

  get(messageType: string) {
    const messagesSection = this._messages[messageType];

    return messagesSection ? messagesSection.array : void 0;
  }

  getById(messageType: string, id: string) {
    const messagesSection = this._messages[messageType];

    return messagesSection ? messagesSection.map[id] : void 0;
  }

  getMessageCount() {
    return Object.keys(this._messages).reduce((acc, type) => {
      const messagesSection = this._messages[type];
      return messagesSection
        ? acc + messagesSection.array.length
        : acc;
    }, 0);
  }

  delete(messageType: string) {
    this._messages[messageType] = void 0;
  }

  deleteById(messageType: string, id: string) {
    const messagesToDelete = this.getById(messageType, id);
    const messagesSection = this._messages[messageType];

    if (!messagesToDelete || !messagesSection) {
      return;
    }

    messagesSection.array = messagesSection.array
      .filter((message) => !messagesToDelete.includes(message));
    messagesSection.map[id] = void 0;
  }

  sendDelayed() {
    if (!this._delayedMessages.length) {
      return;
    }

    this._delayedMessages.forEach((message) => {
      this.send(message);
    });
    this._delayedMessages = [];
  }

  clear() {
    this._messages = {};
  }

  reset() {
    this._messages = {};
    this._delayedMessages = [];
  }
}
