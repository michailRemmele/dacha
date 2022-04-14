export interface SystemOptions {
  deltaTime: number;
}

export interface System {
  systemDidMount?(): void;
  systemWillUnmount?(): void;
  update(options: SystemOptions): void;
}
