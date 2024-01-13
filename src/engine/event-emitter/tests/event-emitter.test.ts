import { EventEmitter } from '../index';
import type { Event } from '../types';

type TestEvent3 = Event<EventEmitter> & {
  field1: number
};

interface TestEvents {
  'test-event-1': Event<EventEmitter>
  'test-event-2': Event<EventEmitter>
  'test-event-3': TestEvent3
}

describe('Engine -> EventEmitter', () => {
  it('Should execute subscription callbacks correctly', () => {
    const eventEmitter = new EventEmitter<TestEvents>();

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();

    eventEmitter.addEventListener('test-event-1', mockFn1);
    eventEmitter.addEventListener('test-event-2', mockFn2);
    eventEmitter.addEventListener('test-event-3', mockFn3);

    eventEmitter.emit('test-event-1');
    eventEmitter.emit('test-event-2');
    eventEmitter.emit('test-event-3', {
      field1: 123,
    });
    eventEmitter.emit('test-event-3', {
      field1: 321,
    });

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(1);
    expect(mockFn3.mock.calls.length).toEqual(2);
  });

  it('Should unsubscribe callbacks correctly', () => {
    const eventEmitter = new EventEmitter<TestEvents>();

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();

    const mockFn3Wrapper = (): void => {
      mockFn3();
      eventEmitter.removeEventListener('test-event-3', mockFn3Wrapper);
    };

    eventEmitter.addEventListener('test-event-1', mockFn1);
    eventEmitter.addEventListener('test-event-2', mockFn2);
    eventEmitter.addEventListener('test-event-3', mockFn3Wrapper);

    eventEmitter.removeEventListener('test-event-2', mockFn2);

    eventEmitter.emit('test-event-1');
    eventEmitter.emit('test-event-2');
    eventEmitter.emit('test-event-3', { field1: 213 });
    eventEmitter.emit('test-event-3', { field1: 213 });
    eventEmitter.emit('test-event-3', { field1: 213 });

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(0);
    expect(mockFn3.mock.calls.length).toEqual(1);

    eventEmitter.removeEventListener('test-event-1', mockFn1);

    eventEmitter.emit('test-event-2');
    eventEmitter.emit('test-event-2');

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(0);
  });
});
