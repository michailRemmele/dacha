import 'reflect-metadata';

import { schemaRegistry } from '../schema-registry';
import { DefineAsset } from '../define-asset';
import { DefineField } from '../define-field';

describe('DefineAsset', () => {
  beforeEach(() => {
    (window as unknown as { DachaWorkbench: unknown }).DachaWorkbench = {};
    schemaRegistry.clear();
  });
  afterEach(() => {
    delete (window as unknown as { DachaWorkbench?: unknown }).DachaWorkbench;
  });

  it('registers a kind whose media file is a normal file field', () => {
    @DefineAsset({ name: 'texture' })
    class TextureKind {
      @DefineField({ type: 'file', extensions: ['png'] }) src = '';
      @DefineField() filterMode = 'nearest';
    }
    void TextureKind;

    const schema = schemaRegistry.getWidget('asset', 'texture');
    expect(schema?.fields).toEqual([
      { name: 'src', type: 'file', extensions: ['png'] },
      { name: 'filterMode', type: 'string' },
    ]);
  });

  it('registers a data kind (no file field)', () => {
    @DefineAsset({ name: 'item' })
    class ItemKind {
      @DefineField({ type: 'number' }) damage = 0;
    }
    void ItemKind;
    expect(schemaRegistry.getWidget('asset', 'item')?.fields).toEqual([
      { name: 'damage', type: 'number' },
    ]);
  });
});
