import { getAssetOptions } from '../get-asset-options';

describe('getAssetOptions', () => {
  it('lists assets of one kind by name', () => {
    expect(
      getAssetOptions(
        [
          { id: 't1', name: 'Hero', kind: 'texture', data: {} },
          { id: 'a1', name: 'Jump', kind: 'audio', data: {} },
        ],
        'texture',
      ),
    ).toEqual([{ title: 'Hero', value: 't1' }]);
  });

  it('handles a project without assets', () => {
    expect(getAssetOptions(undefined, 'texture')).toEqual([]);
  });
});
