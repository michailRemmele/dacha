import type { Point } from '../math-lib';

/**
 * A value another field is compared with in a {@link FieldDependency}.
 *
 * @inline
 * @hidden
 */
export type FieldDependencyValue = string | number | boolean;

/**
 * Shows a field only while another field of the same class has a given value.
 *
 * @category Editor Schema
 */
export interface FieldDependency {
  /** Name of the field to watch. */
  name: string;
  /** The value that shows the field. A string can list several values separated by `|`. */
  value: FieldDependencyValue;
}

/**
 * Reads a value from the project configuration by path.
 *
 * @inline
 * @hidden
 */
export type GetStateFn = (path: string[]) => unknown;

/**
 * Builds the options of a select field from the project configuration.
 *
 * @category Editor Schema
 */
export type GetFieldOptionsFn = (
  getState: GetStateFn,
  context: {
    path: string[];
    data: Record<string, unknown>;
  },
) => FieldOption[] | string[] | number[];

/**
 * One option of a select field.
 *
 * @category Editor Schema
 */
export interface FieldOption {
  /** Text the editor shows. */
  title: string;
  /** Value the configuration stores. */
  value: string | number;
}

/**
 * The widget the editor draws for a field.
 *
 * @category Editor Schema
 */
export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'multitext'
  | 'color'
  | 'file'
  | 'range'
  | 'textarea'
  | 'vector'
  | 'asset';

/**
 * Settings every field shares.
 *
 * @category Editor Schema
 */
export interface AnyField {
  /** Name of the configuration key the field edits. */
  name: string;
  /** The widget the editor draws. */
  type: FieldType;
  /** Translation key of the label. The editor formats the name without it. */
  title?: string;
  /** The value a new instance starts with. */
  initialValue?: unknown;
  /** Shows the field only while another field has a given value. */
  dependency?: FieldDependency;
  /** Section the field is grouped into. */
  section?: string;
}

/**
 * A single-line text input.
 *
 * @category Editor Schema
 */
export interface StringField extends AnyField {
  /** The widget type. */
  type: 'string';
  /** The value a new instance starts with. */
  initialValue?: string;
}

/**
 * A number input.
 *
 * @category Editor Schema
 */
export interface NumberField extends AnyField {
  /** The widget type. */
  type: 'number';
  /** The value a new instance starts with. */
  initialValue?: number;
}

/**
 * A checkbox.
 *
 * @category Editor Schema
 */
export interface BooleanField extends AnyField {
  /** The widget type. */
  type: 'boolean';
  /** The value a new instance starts with. */
  initialValue?: boolean;
}

/**
 * A dropdown.
 *
 * @category Editor Schema
 */
export interface SelectField extends AnyField {
  /** The widget type. */
  type: 'select';
  /** The value a new instance starts with. */
  initialValue?: string | number;
  /** The options, or a function that builds them from the configuration. */
  options: FieldOption[] | string[] | number[] | GetFieldOptionsFn;
}

/**
 * A dropdown that holds several values.
 *
 * @category Editor Schema
 */
export interface MultiselectField extends AnyField {
  /** The widget type. */
  type: 'multiselect';
  /** The value a new instance starts with. */
  initialValue?: string[] | number[];
  /** The options, or a function that builds them from the configuration. */
  options: FieldOption[] | string[] | number[] | GetFieldOptionsFn;
}

/**
 * A list of text inputs.
 *
 * @category Editor Schema
 */
export interface MultitextField extends AnyField {
  /** The widget type. */
  type: 'multitext';
  /** The value a new instance starts with. */
  initialValue?: string[];
}

/**
 * A picker over the project's assets folder.
 *
 * @category Editor Schema
 */
export interface FileField extends AnyField {
  /** The widget type. */
  type: 'file';
  /** The value a new instance starts with. */
  initialValue?: string;
  /** File extensions the picker offers, without the dot. */
  extensions: string[];
}

/**
 * A slider.
 *
 * @category Editor Schema
 */
export interface RangeField extends AnyField {
  /** The widget type. */
  type: 'range';
  /** The value a new instance starts with. */
  initialValue?: number;
  /** Lowest value. */
  min?: number;
  /** Highest value. */
  max?: number;
  /** Step between values. */
  step?: number;
}

/**
 * A color picker.
 *
 * @category Editor Schema
 */
export interface ColorField extends AnyField {
  /** The widget type. */
  type: 'color';
  /** The value a new instance starts with. */
  initialValue?: string;
  /** Hides the alpha channel. */
  disabledAlpha?: boolean;
}

/**
 * A dropdown of the project's assets of one kind.
 *
 * @category Editor Schema
 */
export interface AssetField extends AnyField {
  /** The widget type. */
  type: 'asset';
  /** The asset kind the dropdown lists. */
  kind: string;
  /** The value a new instance starts with. */
  initialValue?: string;
}

/**
 * A multi-line text input.
 *
 * @category Editor Schema
 */
export interface TextAreaField extends AnyField {
  /** The widget type. */
  type: 'textarea';
  /** The value a new instance starts with. */
  initialValue?: string;
}

/**
 * Paired X and Y inputs.
 *
 * @category Editor Schema
 */
export interface VectorField extends AnyField {
  /** The widget type. */
  type: 'vector';
  /** The value a new instance starts with. */
  initialValue?: Point;
}

/**
 * A field the configuration keeps and the editor does not draw.
 *
 * @category Editor Schema
 */
export interface DataField {
  /** Name of the configuration key. */
  name: string;
  /** The widget type. */
  type: 'data';
  /** The value a new instance starts with. */
  initialValue: unknown;
  /** Section the field is grouped into. */
  section?: string;
}

/**
 * Any field of a {@link Schema}.
 *
 * @category Editor Schema
 */
export type Field =
  | StringField
  | NumberField
  | BooleanField
  | SelectField
  | MultiselectField
  | MultitextField
  | FileField
  | RangeField
  | ColorField
  | TextAreaField
  | VectorField
  | AssetField
  | DataField;

/**
 * Settings of one inspector section.
 *
 * @category Editor Schema
 */
export interface SchemaSection {
  /** Whether the section starts open. */
  defaultOpen?: boolean;
}

/**
 * The kind of class a {@link Schema} describes.
 *
 * @category Editor Schema
 */
export type SchemaKind = 'component' | 'system' | 'asset' | 'behavior';

/**
 * How the editor draws a class in the inspector. The engine stores it and never reads it.
 *
 * @category Editor Schema
 */
export interface SchemaOptions {
  /** Translation key of the title. The editor formats the class name without it. */
  title?: string;
  /** Icon name. The editor decides which names exist. */
  icon?: string;
  /** Sections the fields can be grouped into, keyed by section name. */
  sections?: Record<string, SchemaSection>;
  /** Fields declared on the class decorator instead of with `@DefineField`. */
  fields?: Field[];
}

/**
 * The schema a class decorator stores on its class. Read it with `getSchema`.
 *
 * @category Editor Schema
 */
export interface Schema extends Omit<SchemaOptions, 'fields'> {
  /** What the class is. */
  kind: SchemaKind;
  /** The name the configuration uses for the class. */
  name: string;
  /** The behavior type, such as `shader` or `filterEffect`. Behaviors only. */
  type?: string;
  /** Every field, in the order the inspector draws them. */
  fields: Field[];
}
