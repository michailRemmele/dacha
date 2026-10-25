jest.mock('dacha', () => ({
  ...jest.requireActual('../../../../../../dacha/src/engine/reference'),
  ...jest.requireActual('../../../../../../dacha/src/engine/decorators'),
}));

import { DefineAsset, ReferenceWalker } from 'dacha';
import type { AssetConfig } from 'dacha';

import { copyAssets } from '../copy-assets';
import { runCommand } from '../../tests/run-command';

@DefineAsset({
  name: 'item',
  fields: [{ name: 'icon', type: 'asset', kind: 'texture' }],
})
class Item {}

const context = { walker: new ReferenceWalker([Item]) };

const project = {
  assets: [
    { id: 'sword', name: 'Sword', kind: 'item', data: { icon: 'tex' } },
    { id: 'tex', name: 'Icon', kind: 'texture', data: { src: 's.png' } },
  ],
};

const copy = (ids: string[]): AssetConfig[] => {
  const store = runCommand(
    project,
    copyAssets(ids.map((id) => ['assets', `id:${id}`])),
    context,
  );
  return store.get(['assets']) as AssetConfig[];
};

describe('copyAssets', () => {
  it('adds a copy with a new id and a unique name', () => {
    const [, , copied] = copy(['tex']);

    expect(copied).toEqual({
      id: expect.not.stringMatching(/^tex$/),
      name: 'Icon 2',
      kind: 'texture',
      data: { src: 's.png' },
    });
  });

  it('adds nothing when no source asset exists', () => {
    expect(copy(['missing'])).toEqual(project.assets);
  });

  it('points a copied asset at the asset copied with it', () => {
    const [sword, , swordCopy, texCopy] = copy(['sword', 'tex']);

    expect(texCopy.id).not.toBe('tex');
    expect(swordCopy.data.icon).toBe(texCopy.id);
    expect(sword.data.icon).toBe('tex');
  });
});
