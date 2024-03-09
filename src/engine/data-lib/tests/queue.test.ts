import { Queue } from '../queue';

describe('Engine -> DataLib -> Queue', () => {
  it('Adds values in queue and polls them in the right order', () => {
    const queue = new Queue<number>();

    expect(queue.peek()).toBe(null);
    expect(queue.poll()).toBe(null);

    queue.add(1);
    queue.add(2);
    queue.add(3);

    expect(queue.peek()).toBe(1);
    expect(queue.poll()).toBe(1);

    expect(queue.peek()).toBe(2);
    expect(queue.poll()).toBe(2);

    expect(queue.peek()).toBe(3);
    expect(queue.poll()).toBe(3);

    expect(queue.peek()).toBe(null);
    expect(queue.poll()).toBe(null);

    queue.add(4);

    expect(queue.peek()).toBe(4);
    expect(queue.poll()).toBe(4);

    expect(queue.peek()).toBe(null);
    expect(queue.poll()).toBe(null);
  });
});
