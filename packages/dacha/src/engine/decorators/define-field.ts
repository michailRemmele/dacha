import type { Point } from '../math-lib';

import type { DataField, FieldDependency, Field, FieldType } from './types';
import { addField, inferFieldType, nextFieldOrder } from './metadata';

/** @inline */
interface ScriptValue {
  name: string;
  options: Record<string, unknown>;
}

/**
 * The value type each field type edits. {@link DefineField} accepts a field type on a
 * member whose type matches its value type here.
 */
export interface FieldValueMap {
  string: string;
  textarea: string;
  color: string;
  file: string;
  asset: string;
  select: string | number;
  number: number;
  range: number;
  boolean: boolean;
  vector: Point;
  multitext: string[];
  multiselect: string[] | number[];
  script: ScriptValue | (ScriptValue & { id: string })[];
}

type FieldTypeFor<V> = {
  [T in keyof FieldValueMap]: [V] extends [FieldValueMap[T]] ? T : never;
}[keyof FieldValueMap];

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/**
 * Options of {@link DefineField} for a field of type `T`: the settings of that field,
 * without `initialValue`, and with an optional `name`.
 *
 * @category Editor Schema
 */
export type FieldOptions<T extends FieldType> = DistributiveOmit<
  Extract<Field, { type: T }>,
  'name' | 'initialValue'
> & { name?: string };

/**
 * The context TypeScript passes to a {@link FieldDecorator}.
 *
 * @inline
 * @hidden
 */
export type FieldDecoratorContext<This, V> =
  | ClassFieldDecoratorContext<This, V>
  | ClassGetterDecoratorContext<This, V>
  | ClassSetterDecoratorContext<This, V>
  | ClassAccessorDecoratorContext<This, V>;

/**
 * A decorator for a class field, getter, setter or accessor.
 *
 * @category Editor Schema
 */
export type FieldDecorator<This, V> = (
  value: unknown,
  context: FieldDecoratorContext<This, V>,
) => void;

/**
 * The value the configuration stores for a member of type `V`. A point-like member,
 * such as a `Vector`, is stored as a plain `{ x, y }` point.
 */
type ConfigValue<V> = [V] extends [Point] ? Point : V;

/** @inline */
type Inferable = string | number | boolean | Point;

/**
 * Options shared by every form of {@link DefineField}.
 *
 * @category Editor Schema
 */
export interface FieldBaseOptions {
  /** Name of the configuration key. Defaults to the member name. */
  name?: string;
  /** Translation key of the label. The editor formats the name without it. */
  title?: string;
  /** Section the field is grouped into. */
  section?: string;
  /** Shows the field only while another field has a given value. */
  dependency?: FieldDependency;
}

/**
 * Makes a member editable in the inspector.
 *
 * The widget comes from `type`. Without it, it comes from the type of `initialValue`:
 * a number, a string, a boolean, or a point for a vector. Without either, the field is a
 * text input, and the member must be a string.
 *
 * @param options - How the editor draws the field.
 * @returns The member decorator.
 *
 * @category Editor Schema
 */
export function DefineField<This, V>(
  options: Omit<DataField, 'name'> & { name?: string },
): FieldDecorator<This, V>;
export function DefineField<This, V extends string | undefined>(
  options?: FieldBaseOptions,
): FieldDecorator<This, V>;
export function DefineField<
  This,
  V,
  T extends FieldTypeFor<NonNullable<NoInfer<V>>>,
>(
  options: FieldOptions<T> & {
    type: T;
    initialValue?: T extends 'script'
      ? never
      : ConfigValue<NoInfer<NonNullable<V>>>;
  },
): FieldDecorator<This, V>;
export function DefineField<This, V extends Inferable | undefined>(
  options: FieldBaseOptions & {
    initialValue: ConfigValue<NoInfer<NonNullable<V>>>;
  },
): FieldDecorator<This, V>;
export function DefineField(
  options: Partial<Field> & { name?: string } = {},
): FieldDecorator<unknown, unknown> {
  const order = nextFieldOrder();
  return (_value, context) => {
    if (context.static || context.private || typeof context.name === 'symbol') {
      throw new Error(
        `DefineField works only on public instance members with a string name, not on ${String(context.name)}`,
      );
    }
    addField(
      context.metadata,
      {
        ...options,
        name: options.name ?? String(context.name),
        type: inferFieldType(options.type, options.initialValue),
      } as Field,
      order,
    );
  };
}
