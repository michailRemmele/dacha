import { EventTarget } from '../index';
import type { Event } from '../types';

interface TestEvents {}

type TestEvent3 = Event & {
  field1: number
};

interface TestEvents {
  'test-event-1': Event
  'test-event-2': Event
  'test-event-3': TestEvent3
}

describe('Engine -> EventTarget', () => {
  it('Should execute subscription callbacks correctly', () => {
    const eventTarget = new EventTarget();

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();

    eventTarget.addEventListener('test-event-1', mockFn1);
    eventTarget.addEventListener('test-event-2', mockFn2);
    eventTarget.addEventListener('test-event-3', mockFn3);

    eventTarget.emit('test-event-1');
    eventTarget.emit('test-event-2');
    eventTarget.emit('test-event-3', {
      field1: 123,
    });
    eventTarget.emit('test-event-3', {
      field1: 321,
    });

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(1);
    expect(mockFn3.mock.calls.length).toEqual(2);
  });

  it('Should unsubscribe callbacks correctly', () => {
    const eventTarget = new EventTarget();

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();

    const mockFn3Wrapper = (): void => {
      mockFn3();
      eventTarget.removeEventListener('test-event-3', mockFn3Wrapper);
    };

    eventTarget.addEventListener('test-event-1', mockFn1);
    eventTarget.addEventListener('test-event-2', mockFn2);
    eventTarget.addEventListener('test-event-3', mockFn3Wrapper);

    eventTarget.removeEventListener('test-event-2', mockFn2);

    eventTarget.emit('test-event-1');
    eventTarget.emit('test-event-2');
    eventTarget.emit('test-event-3', { field1: 213 });
    eventTarget.emit('test-event-3', { field1: 213 });
    eventTarget.emit('test-event-3', { field1: 213 });

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(0);
    expect(mockFn3.mock.calls.length).toEqual(1);

    eventTarget.removeEventListener('test-event-1', mockFn1);

    eventTarget.emit('test-event-2');
    eventTarget.emit('test-event-2');

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(0);
  });

  it('Should propagate event to parents', () => {
    const child = new EventTarget();
    const parent = new EventTarget();
    const superParent = new EventTarget();

    child.parent = parent;
    parent.parent = superParent;

    const mockFn1 = jest.fn();

    superParent.addEventListener('test-event-1', mockFn1);

    child.emit('test-event-1');

    expect(mockFn1.mock.calls.length).toEqual(1);

    parent.emit('test-event-1');

    expect(mockFn1.mock.calls.length).toEqual(2);
  });

  it('Should stop propagation to parents', () => {
    const child = new EventTarget();
    const parent = new EventTarget();
    const superParent = new EventTarget();

    child.parent = parent;
    parent.parent = superParent;

    const mockFn1 = jest.fn();

    const mockFn2 = jest.fn();
    const mockFn2Wrapper = (event: TestEvents['test-event-1']): void => {
      event.stopPropagation();
      mockFn2();
    };

    const mockFn3 = jest.fn();

    child.addEventListener('test-event-1', mockFn1);
    parent.addEventListener('test-event-1', mockFn2Wrapper);
    superParent.addEventListener('test-event-1', mockFn3);

    child.emit('test-event-1');

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(1);
    expect(mockFn3.mock.calls.length).toEqual(0);

    parent.emit('test-event-1');

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(2);
    expect(mockFn3.mock.calls.length).toEqual(0);
  });
});
