export interface ProcessorOptions {
  deltaTime: number;
  messageBus: object;
}

export interface Processor {
  processorDidMount?(): void;
  processorWillUnmount?(): void;
  process(options: ProcessorOptions): void;
}
