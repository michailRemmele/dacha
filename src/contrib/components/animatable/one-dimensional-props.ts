import type { OneDimensionalPropsConfig } from './types';

const SEPARATOR = '.';

export class OneDimensionalProps {
  x: string | string[];

  constructor(config: unknown) {
    const { x = '' } = config as OneDimensionalPropsConfig;

    this.x = Array.isArray(x) ? x.slice(0) : x.split(SEPARATOR);
  }
}
