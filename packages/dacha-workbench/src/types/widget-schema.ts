import type { FC } from 'react';
import type * as GravityIcons from '@gravity-ui/icons';
import type { Point } from 'dacha';

export type IconName = keyof typeof GravityIcons;

export type DependencyValue = string | number | boolean;

export interface Dependency {
  name: string;
  value: DependencyValue;
}

export type GetStateFn = (path: string[]) => unknown;

export type GetOptionsFn = (
  getState: GetStateFn,
  context: {
    path: string[];
    data: Record<string, unknown>;
  },
) => Option[] | string[] | number[];

export interface Option {
  title: string;
  value: string | number;
}

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

export interface AnyField {
  name: string;
  type: FieldType;
  title?: string;
  initialValue?: unknown;
  dependency?: Dependency;
  section?: string;
}

export interface StringField extends AnyField {
  type: 'string';
}

export interface NumberField extends AnyField {
  type: 'number';
  initialValue?: number;
}

export interface BooleanField extends AnyField {
  type: 'boolean';
  initialValue?: boolean;
}

export interface SelectField extends AnyField {
  type: 'select';
  initialValue?: string | number;
  options: Option[] | string[] | number[] | GetOptionsFn;
}

export interface MultiselectField extends AnyField {
  type: 'multiselect';
  initialValue?: string[] | number[];
  options: Option[] | string[] | number[] | GetOptionsFn;
}

export interface MultitextField extends AnyField {
  type: 'multitext';
  initialValue?: string[];
}

export interface FileField extends AnyField {
  type: 'file';
  initialValue?: string;
  extensions: string[];
}

export interface RangeField extends AnyField {
  type: 'range';
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface ColorField extends AnyField {
  type: 'color';
  initialValue?: string;
  disabledAlpha?: boolean;
}

export interface AssetField extends AnyField {
  type: 'asset';
  kind: string;
  initialValue?: string;
}

export interface TextAreaField extends AnyField {
  type: 'textarea';
}

export interface VectorField extends AnyField {
  type: 'vector';
  initialValue?: Point;
}

export interface DataField {
  name: string;
  type: 'data';
  initialValue: unknown;
  section?: string;
}

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

export interface SectionSettings {
  defaultOpen?: boolean;
}

export interface WidgetProps {
  path: string[];
  fields?: Field[];
  sections?: Record<string, SectionSettings>;
  context?: Record<string, unknown>;
}

export interface WidgetSchema {
  title?: string;
  fields?: Field[];
  sections?: Record<string, SectionSettings>;
  view?: FC<WidgetProps>;
  icon?: IconName;
}
