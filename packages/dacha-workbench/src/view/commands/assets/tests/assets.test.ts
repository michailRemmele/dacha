import { addAsset } from '../add-asset';
import { ADD_VALUE } from '../../../../command-types';
import type { WidgetSchema } from '../../../../types/widget-schema';

describe('addAsset', () => {
  it('adds a media asset with unique name and initial data (file field defaults to empty string)', () => {
    const schema: WidgetSchema = {
      fields: [
        { name: 'src', type: 'file', extensions: ['png'] },
        { name: 'filterMode', type: 'string', initialValue: 'nearest' },
      ],
    };
    const state: Record<string, unknown> = {
      assets: [
        { id: 'x', name: 'texture', kind: 'texture', data: { src: '' } },
      ],
    };
    const dispatched: unknown[] = [];

    addAsset('texture', schema)(
      (cmd) => dispatched.push(cmd),
      (path) => state[path[0]],
    );

    expect(dispatched).toHaveLength(1);
    const cmd = dispatched[0] as {
      command: string;
      options: { path: string[]; value: Record<string, unknown> };
    };
    expect(cmd.command).toBe(ADD_VALUE);
    expect(cmd.options.path).toEqual(['assets']);
    expect(cmd.options.value.kind).toBe('texture');
    expect(cmd.options.value.name).toBe('texture 2');
    expect('src' in cmd.options.value).toBe(false);
    expect(cmd.options.value.data).toEqual({ src: '', filterMode: 'nearest' });
    expect(typeof cmd.options.value.id).toBe('string');
  });

  it('builds data for a data asset (no file field)', () => {
    const schema: WidgetSchema = {
      fields: [{ name: 'damage', type: 'number', initialValue: 5 }],
    };
    const dispatched: unknown[] = [];

    addAsset('item', schema)(
      (cmd) => dispatched.push(cmd),
      () => [],
    );

    const value = (
      dispatched[0] as { options: { value: Record<string, unknown> } }
    ).options.value;
    expect('src' in value).toBe(false);
    expect(value.kind).toBe('item');
    expect(value.data).toEqual({ damage: 5 });
  });
});
