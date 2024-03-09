interface QueueNode<T> {
  next: QueueNode<T> | null
  value: T
}

export class Queue<T> {
  private head: QueueNode<T> | null;
  private tail: QueueNode<T> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  add(value: T): void {
    const node = { next: null, value };

    if (this.tail === null) {
      this.head = node;
      this.tail = node;
      return;
    }

    this.tail.next = node;
    this.tail = node;
  }

  poll(): T | null {
    if (this.head === null) {
      return null;
    }

    const node = this.head;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      return node.value;
    }

    this.head = this.head.next;
    return node.value;
  }

  peek(): T | null {
    return this.head ? this.head.value : null;
  }
}
