import type { Schema, SchemaKind, SchemaOptions } from './types';
import {
  defineStaticName,
  getDecoratedFields,
  mergeFields,
  setInheritedFields,
  setSchema,
} from './metadata';

/** @inline */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClass = abstract new (...args: any[]) => unknown;

/**
 * A decorator for a class.
 *
 * @inline
 * @hidden
 */
export type DefineClassDecorator = (
  value: AnyClass,
  context: ClassDecoratorContext,
) => void;

/**
 * Options of {@link DefineComponent}, {@link DefineSystem} and {@link DefineBehavior}.
 *
 * @category Editor Schema
 */
export interface DefineOptions extends SchemaOptions {
  /** The name the configuration uses for the class. */
  name: string;
}

/**
 * Options of {@link DefineAsset}.
 *
 * @category Assets
 */
export type DefineAssetOptions = Pick<DefineOptions, 'name' | 'fields'>;

/**
 * Builds a class decorator for one schema kind.
 */
export const defineClass =
  (
    kind: SchemaKind,
    nameKey: string,
    name: string,
    options: SchemaOptions,
  ): DefineClassDecorator =>
  (value, context) => {
    const { fields, ...widget } = options;
    const schema: Schema = {
      kind,
      name,
      ...widget,
      fields: mergeFields(fields, getDecoratedFields(context.metadata)),
    };
    setSchema(context.metadata, schema);
    setInheritedFields(context.metadata, schema.fields);
    defineStaticName(value, nameKey, name);
  };

/**
 * Names a component and describes it to the editor.
 *
 * @param options - The component's name and inspector options.
 * @returns The class decorator.
 *
 * @category Actors & Components
 */
export const DefineComponent = ({
  name,
  ...options
}: DefineOptions): DefineClassDecorator =>
  defineClass('component', 'componentName', name, options);

/**
 * Names a system and describes its settings to the editor.
 *
 * @param options - The system's name and inspector options.
 * @returns The class decorator.
 *
 * @category Systems
 */
export const DefineSystem = ({
  name,
  ...options
}: DefineOptions): DefineClassDecorator =>
  defineClass('system', 'systemName', name, options);

/**
 * Names an asset kind and describes its fields to the editor.
 *
 * @param options - The asset kind's name and fields.
 * @returns The class decorator.
 *
 * @category Assets
 */
export const DefineAsset = ({
  name,
  fields,
}: DefineAssetOptions): DefineClassDecorator =>
  defineClass('asset', 'assetName', name, { fields });

/**
 * Names a behavior and describes its settings to the editor.
 *
 * @param options - The behavior's name and inspector options.
 * @returns The class decorator.
 *
 * @category Behaviors
 */
export const DefineBehavior = ({
  name,
  ...options
}: DefineOptions): DefineClassDecorator =>
  defineClass('behavior', 'behaviorName', name, options);
