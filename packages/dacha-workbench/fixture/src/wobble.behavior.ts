import { Behavior, DefineBehavior, DefineField } from 'dacha';
import type { BehaviorOptions } from 'dacha';

interface WobbleOptions extends BehaviorOptions {
  amplitude: number;
}

@DefineBehavior({ name: 'Wobble' })
export default class Wobble extends Behavior {
  @DefineField({ initialValue: 3 })
  amplitude: number;

  constructor(options: WobbleOptions) {
    super();

    this.amplitude = options.amplitude;
  }
}
