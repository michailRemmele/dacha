import { OneDimensionalProps } from './one-dimensional-props';
import type { TwoDimensionalPropsConfig } from './types';

const SEPARATOR = '.';

export class TwoDimensionalProps extends OneDimensionalProps {
  y: string | string[];

  constructor(config: unknown) {
    super(config);

    const { y = '' } = config as TwoDimensionalPropsConfig;

    this.y = Array.isArray(y) ? y.slice(0) : y.split(SEPARATOR);
  }
}
