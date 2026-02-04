import type { Shader } from 'dacha';

import type { WidgetSchema } from '../types/widget-schema';
import { type BehaviorConstructor } from '../types/engine';

import { DefineBehavior } from './define-behavior';

interface DefineShaderOptions extends Omit<WidgetSchema, 'view'> {
  name: string;
}

export function DefineShader(
  options: DefineShaderOptions,
): (constructor: BehaviorConstructor<Shader>) => void {
  return (
    constructor: BehaviorConstructor<Shader>,
  ): void => {
    return DefineBehavior({ ...options, systemName: 'shader' })(
      constructor,
    );
  };
}
