export interface Watcher {
  handle(path: string[]): void;
}
