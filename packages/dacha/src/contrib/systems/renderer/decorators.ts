import type {
  DefineClassDecorator,
  DefineOptions,
} from '../../../engine/decorators';
import { defineClass } from '../../../engine/decorators/define-class';

/**
 * Names a shader and describes its settings to the editor.
 *
 * @param options - The shader's name and inspector options.
 * @returns The class decorator.
 *
 * @category Rendering
 */
export const DefineShader = ({
  name,
  ...options
}: DefineOptions): DefineClassDecorator =>
  defineClass('shader', 'shaderName', name, options);

/**
 * Names a filter effect and describes its settings to the editor.
 *
 * @param options - The filter effect's name and inspector options.
 * @returns The class decorator.
 *
 * @category Rendering
 */
export const DefineFilterEffect = ({
  name,
  ...options
}: DefineOptions): DefineClassDecorator =>
  defineClass('filterEffect', 'filterEffectName', name, options);
