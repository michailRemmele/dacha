import { MessageBus } from '../index';

describe('Engine -> MessageBus', () => {
  it('Sends and returns messages without id correctly', () => {
    const messageBus = new MessageBus();

    const message1 = {
      type: 'test-message-1',
      arg1: 12,
      arg: 'Hello world',
    };
    const message2 = {
      type: 'test-message-2',
      arg1: false,
      arg: 100,
    };

    messageBus.send(message1);
    messageBus.send(message2);
    messageBus.send(message1);

    expect(messageBus.getMessageCount()).toEqual(3);

    expect(messageBus.get('test-message-1')?.length).toEqual(2);
    expect(messageBus.get('test-message-2')?.length).toEqual(1);

    expect(messageBus.get('test-message-1')?.[0]).toEqual(message1);
    expect(messageBus.get('test-message-1')?.[1]).toEqual(message1);
    expect(messageBus.get('test-message-2')?.[0]).toEqual(message2);
  });

  it('Sends and returns messages with id correctly', () => {
    const messageBus = new MessageBus();

    const message1 = {
      type: 'test-message-1',
      id: 'id-1',
      arg1: 12,
      arg: 'Hello world',
    };
    const message2 = {
      type: 'test-message-1',
      id: 'id-2',
      arg1: false,
      arg: 100,
    };
    const message3 = {
      type: 'test-message-2',
    };

    messageBus.send(message1);
    messageBus.send(message1);
    messageBus.send(message3);
    messageBus.send(message2);

    expect(messageBus.getMessageCount()).toEqual(4);

    expect(messageBus.getById('test-message-1', 'id-1')?.length).toEqual(2);
    expect(messageBus.getById('test-message-1', 'id-2')?.length).toEqual(1);

    expect(messageBus.getById('test-message-1', 'id-1')?.[0]).toEqual(message1);
    expect(messageBus.getById('test-message-1', 'id-1')?.[1]).toEqual(message1);
    expect(messageBus.getById('test-message-1', 'id-2')?.[0]).toEqual(message2);

    expect(messageBus.get('test-message-1')).toEqual([message1, message1, message2]);
  });
});
