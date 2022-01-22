export interface EventEmitter {
  subscribe(type: string, callback: (event: unknown) => void): void
  unsubscribe(type: string, callback: (event: unknown) => void): void
  fireEvents(): void
}
