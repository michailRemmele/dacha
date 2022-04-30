import type { System, SystemOptions } from '../../../engine/system';
import type { MessageBus } from '../../../engine/message-bus';

interface JammerOptions extends SystemOptions {
  messages: Array<string>;
}

export class Jammer implements System {
  private messageBus: MessageBus;
  private messages: Array<string>;

  constructor(options: JammerOptions) {
    this.messages = options.messages;
    this.messageBus = options.messageBus;
  }

  update(): void {
    this.messages.forEach((message) => {
      this.messageBus.delete(message);
    });
  }
}
