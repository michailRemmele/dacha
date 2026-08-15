import { Queue } from '../data-lib';

type EventExecutor = () => void;

export class EventQueue {
  private executorQueue: Queue<EventExecutor>;

  constructor() {
    this.executorQueue = new Queue();
  }

  add(executor: EventExecutor): void {
    this.executorQueue.add(executor);
  }

  update(): void {
    while (this.executorQueue.peek() !== null) {
      this.executorQueue.poll()?.();
    }
  }
}

export const eventQueue = new EventQueue();
