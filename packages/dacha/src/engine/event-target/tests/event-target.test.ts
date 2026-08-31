import { EventTarget } from '../event-target';
import { eventQueue } from '../event-queue';
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

    eventTarget.dispatchEvent('test-event-1');
    eventTarget.dispatchEvent('test-event-2');
    eventTarget.dispatchEvent('test-event-3', {
      field1: 123,
    });
    eventTarget.dispatchEvent('test-event-3', {
      field1: 321,
    });

    expect(mockFn1.mock.calls.length).toEqual(0);
    expect(mockFn2.mock.calls.length).toEqual(0);
    expect(mockFn3.mock.calls.length).toEqual(0);

    eventQueue.update();

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

    eventTarget.dispatchEvent('test-event-1');
    eventTarget.dispatchEvent('test-event-2');
    eventTarget.dispatchEvent('test-event-3', { field1: 213 });
    eventTarget.dispatchEvent('test-event-3', { field1: 213 });
    eventTarget.dispatchEvent('test-event-3', { field1: 213 });

    eventQueue.update();

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(0);
    expect(mockFn3.mock.calls.length).toEqual(1);

    eventTarget.removeEventListener('test-event-1', mockFn1);

    eventTarget.dispatchEvent('test-event-2');
    eventTarget.dispatchEvent('test-event-2');

    eventQueue.update();

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

    child.dispatchEvent('test-event-1');
    parent.dispatchEvent('test-event-1');

    eventQueue.update();

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

    child.dispatchEvent('test-event-1');

    eventQueue.update();

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(1);
    expect(mockFn3.mock.calls.length).toEqual(0);

    parent.dispatchEvent('test-event-1');

    eventQueue.update();

    expect(mockFn1.mock.calls.length).toEqual(1);
    expect(mockFn2.mock.calls.length).toEqual(2);
    expect(mockFn3.mock.calls.length).toEqual(0);
  });

  it('Should handle event sent during another event handle', () => {
    const target = new EventTarget();

    const mockFn = jest.fn();

    const listener1 = (event: Event): void => {
      event.target.dispatchEvent('test-event-2');
      mockFn();
    };
    const listener2 = (): void => {
      mockFn();
    };

    target.addEventListener('test-event-1', listener1);
    target.addEventListener('test-event-2', listener2);

    target.dispatchEvent('test-event-1');

    eventQueue.update();

    expect(mockFn.mock.calls.length).toEqual(2);
  });
});
