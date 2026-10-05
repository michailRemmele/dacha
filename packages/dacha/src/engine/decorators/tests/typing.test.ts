import { Component } from '../../component';
import { Vector } from '../../math-lib';
import { DefineField } from '..';
import type { FieldType } from '..';
import type { FieldValueMap } from '../define-field';

class Valid extends Component {
  @DefineField() s!: string;
  @DefineField() so?: string;
  @DefineField({ type: 'select', options: ['a', 'b'] }) mode!: 'a' | 'b';
  @DefineField({ initialValue: 'a' }) mode2!: 'a' | 'b';
  @DefineField({ initialValue: { x: 0, y: 0 } }) p!: { x: number; y: number };
  @DefineField({ initialValue: 0.5 }) o?: number;
  @DefineField({ type: 'range' }) r!: number;
  @DefineField({ type: 'data', initialValue: [] }) d!: string[];
  @DefineField({ initialValue: { x: 0, y: -1 } }) up!: Vector;
  @DefineField({ type: 'vector', initialValue: { x: 0, y: 0 } }) normal?: Vector;
  @DefineField({ type: 'data', initialValue: [] }) map!: Record<string, number>;
  @DefineField({ type: 'multiselect', options: [1, 2] }) ids!: number[];
  @DefineField({ type: 'color', disabledAlpha: true }) c!: string;
  @DefineField({ type: 'file', extensions: ['png'] }) f!: string;
  @DefineField({ type: 'script', kind: 'shader' })
  sh?: { name: string; options: Record<string, unknown> };
  @DefineField({ type: 'script', kind: 'behavior', multiple: true })
  bs!: { id: string; name: string; options: Record<string, unknown> }[];
}

class Invalid extends Component {
  // @ts-expect-error a bare field decorator is for strings only
  @DefineField() n!: number;
  // @ts-expect-error initialValue must match the field type
  @DefineField({ initialValue: 10 }) name!: string;
  // @ts-expect-error a number widget on a string field
  @DefineField({ type: 'number' }) label!: string;
  // @ts-expect-error a boolean initialValue on a number field
  @DefineField({ initialValue: true }) flag!: number;
  // @ts-expect-error select needs options
  @DefineField({ type: 'select' }) sel!: string;
  // @ts-expect-error a data field needs an initialValue
  @DefineField({ type: 'data' }) raw!: string[];
  // @ts-expect-error multitext holds strings only
  @DefineField({ type: 'multitext' }) numbers!: number[];
  // @ts-expect-error a script field holds { name, options }
  @DefineField({ type: 'script', kind: 'shader' }) notScript!: number;
  @DefineField({
    type: 'script',
    kind: 'shader',
    // @ts-expect-error a script field has no initialValue
    initialValue: { name: 'a', options: {} },
  })
  withInitial?: { name: string; options: Record<string, unknown> };
}

// Every field type needs a value type, or @DefineField accepts it on no member.
type MissingFieldTypes = Exclude<FieldType, keyof FieldValueMap>;
const everyFieldTypeHasAValue: [MissingFieldTypes] extends [never]
  ? true
  : MissingFieldTypes = true;

it('compiles', () => {
  expect(Valid).toBeDefined();
  expect(Invalid).toBeDefined();
  expect(everyFieldTypeHasAValue).toBe(true);
});
