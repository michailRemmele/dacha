import {
  DefineBehavior,
  type DefineClassDecorator,
  type DefineOptions,
} from '../../../engine/decorators';

/**
 * Names a shader and describes its settings to the editor.
 *
 * @param options - The shader's name and inspector options.
 * @returns The class decorator.
 *
 * @category Rendering
 */
export const DefineShader = (options: DefineOptions): DefineClassDecorator =>
  DefineBehavior({ ...options, type: 'shader' });

/**
 * Names a filter effect and describes its settings to the editor.
 *
 * @param options - The filter effect's name and inspector options.
 * @returns The class decorator.
 *
 * @category Rendering
 */
export const DefineFilterEffect = (options: DefineOptions): DefineClassDecorator =>
  DefineBehavior({ ...options, type: 'filterEffect' });
