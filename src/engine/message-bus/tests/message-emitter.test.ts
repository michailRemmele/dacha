import { MessageBus, MessageEmitter } from '../index';

describe('Engine -> MessageEmitter', () => {
  it('Should execute subscription callbacks correctly', () => {
    const messageBus = new MessageBus();
    const messageEmitter = new MessageEmitter(messageBus);

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    const mockFn4 = jest.fn();

    messageEmitter.on('test-message-1', mockFn1);
    messageEmitter.on('test-message-1', mockFn2, { id: '123' });
    messageEmitter.on('test-message-2', mockFn3);
    messageEmitter.on('test-message-1', mockFn4);

    messageEmitter.emit({
      type: 'test-message-1',
    });
    messageEmitter.emit({
      type: 'test-message-2',
    });
    messageEmitter.emit({
      type: 'test-message-1',
      id: '123',
    });
    messageEmitter.emit({
      type: 'test-message-1',
      id: '321',
    });

    messageEmitter.fireAll();

    expect(mockFn1.mock.calls.length).toEqual(3);
    expect(mockFn2.mock.calls.length).toEqual(1);
    expect(mockFn3.mock.calls.length).toEqual(1);
    expect(mockFn4.mock.calls.length).toEqual(3);
  });

  it('Should unsubscribe callbacks correctly', () => {
    const messageBus = new MessageBus();
    const messageEmitter = new MessageEmitter(messageBus);

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    messageEmitter.on('test-message-1', mockFn1);
    messageEmitter.on('test-message-1', mockFn1, { id: '123' });
    messageEmitter.on('test-message-2', mockFn2);

    messageEmitter.off('test-message-1', mockFn1, { id: '123' });

    messageEmitter.emit({
      type: 'test-message-1',
      id: '123',
    });
    messageEmitter.emit({
      type: 'test-message-2',
    });

    messageEmitter.fireAll();
    messageBus.clear();

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(1);

    messageEmitter.off('test-message-1', mockFn1);

    messageEmitter.emit({
      type: 'test-message-1',
    });
    messageEmitter.emit({
      type: 'test-message-2',
    });

    messageEmitter.fireAll();

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(2);
  });
});
