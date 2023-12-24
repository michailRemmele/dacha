import type { MessageBus, Message } from './message-bus';

type ListenerFn = (payload: unknown) => void;

type ListenerOptions = {
  id?: string
};

const isOptionsEqual = (opt1?: ListenerOptions, opt2?: ListenerOptions): boolean => {
  const id1 = opt1?.id ?? undefined;
  const id2 = opt2?.id ?? undefined;

  return id1 === id2;
};

export class MessageEmitter {
  private messageBus: MessageBus;
  private listenersMap: Map<string, Array<[ListenerFn, ListenerOptions | undefined]>>;

  constructor(messageBus: MessageBus) {
    this.messageBus = messageBus;
    this.listenersMap = new Map();
  }

  on(messageType: string, callback: ListenerFn, options?: ListenerOptions): void {
    if (!this.listenersMap.has(messageType)) {
      this.listenersMap.set(messageType, []);
    }

    this.listenersMap.get(messageType)?.push([callback, options]);
  }

  off(messageType: string, callback: ListenerFn, options?: ListenerOptions): void {
    if (!this.listenersMap.has(messageType)) {
      return;
    }

    const nextListeners = this.listenersMap.get(messageType)!.filter(
      (listener) => listener[0] !== callback || !isOptionsEqual(listener[1], options),
    );

    if (nextListeners.length === 0) {
      this.listenersMap.delete(messageType);
    } else {
      this.listenersMap.set(messageType, nextListeners);
    }
  }

  emit(message: Message, delay?: boolean): void {
    this.messageBus.send(message, delay);
  }

  fireAll(): void {
    this.listenersMap.forEach((listeners, messageType) => {
      if (!this.messageBus.get(messageType)) {
        return;
      }

      listeners.forEach(([fn, options]) => {
        const id = options?.id ?? undefined;
        const messages = id !== undefined
          ? this.messageBus.getById(messageType, id)
          : this.messageBus.get(messageType);

        messages?.forEach((message) => fn(message));
      });
    });
  }
}
