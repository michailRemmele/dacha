import type { FilterEffect } from 'dacha';

import type { WidgetSchema } from '../types/widget-schema';
import { type BehaviorConstructor } from '../types/engine';

import { DefineBehavior } from './define-behavior';

interface DefineFilterEffectOptions extends Omit<WidgetSchema, 'view'> {
  name: string;
}

export function DefineFilterEffect(
  options: DefineFilterEffectOptions,
): (constructor: BehaviorConstructor<FilterEffect>) => void {
  return (constructor: BehaviorConstructor<FilterEffect>): void => {
    return DefineBehavior({ ...options, type: 'filterEffect' })(constructor);
  };
}
