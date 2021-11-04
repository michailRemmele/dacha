import { OneDimensionalProps, OneDimensionalPropsConfig } from './one-dimensional-props';

export interface TwoDimensionalPropsConfig extends OneDimensionalPropsConfig {
  y: string | Array<string>;
}

const SEPARATOR = '.';

export class TwoDimensionalProps extends OneDimensionalProps {
  y: string | Array<string>;

  constructor(config: unknown) {
    super(config);

    const { y } = config as TwoDimensionalPropsConfig;

    this.y = Array.isArray(y)
      ? y.slice(0)
      : y.split(SEPARATOR);
  }
}
