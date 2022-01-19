export interface ProcessorOptions {
  deltaTime: number;
}

export interface Processor {
  processorDidMount?(): void;
  processorWillUnmount?(): void;
  process(options: ProcessorOptions): void;
}
