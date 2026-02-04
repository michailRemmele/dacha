import type { PostEffect } from 'dacha';

import type { WidgetSchema } from '../types/widget-schema';
import { type BehaviorConstructor } from '../types/engine';

import { DefineBehavior } from './define-behavior';

interface DefinePostEffectOptions extends Omit<WidgetSchema, 'view'> {
  name: string;
}

export function DefinePostEffect(
  options: DefinePostEffectOptions,
): (constructor: BehaviorConstructor<PostEffect>) => void {
  return (
    constructor: BehaviorConstructor<PostEffect>,
  ): void => {
    return DefineBehavior({ ...options, systemName: 'postEffect' })(
      constructor,
    );
  };
}
