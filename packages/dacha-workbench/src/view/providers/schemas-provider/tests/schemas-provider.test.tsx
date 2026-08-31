jest.mock('dacha', () => ({
  Texture: { assetName: 'texture' },
  Audio: { assetName: 'audio' },
  BitmapFont: { assetName: 'bitmapFont' },
}));

import { buildSchema } from '../build-schema';
import { assetsSchema } from '../../../modules/inspector/widgets/assets';

describe('buildSchema (assets group)', () => {
  it('maps built-in asset schemas to editor-namespace entries', () => {
    const entries = buildSchema(assetsSchema, undefined);
    const names = entries.map((e) => e.name);
    expect(names).toContain('texture');
    expect(names).toContain('audio');
    expect(names).toContain('bitmapFont');
    entries.forEach((e) => expect(e.namespace).toBe('translation'));
  });

  it('appends extension schemas under the extension namespace', () => {
    const entries = buildSchema({}, { item: { fields: [] } });
    expect(entries).toEqual([
      { name: 'item', schema: { fields: [] }, namespace: 'extension' },
    ]);
  });
});
