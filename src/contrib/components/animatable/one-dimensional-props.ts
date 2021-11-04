export interface OneDimensionalPropsConfig {
  x: string | Array<string>;
}

const SEPARATOR = '.';

export class OneDimensionalProps {
  x: string | Array<string>;

  constructor(config: unknown) {
    const { x } = config as OneDimensionalPropsConfig;

    this.x = Array.isArray(x)
      ? x.slice(0)
      : x.split(SEPARATOR);
  }
}
