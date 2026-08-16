import { isValidElement, ReactElement } from 'react';
import type { AssetConfig } from 'dacha';

jest.mock('../../../../../../utils/format-widget-name', () => ({
  formatWidgetName: (name: string): string => name,
}));

jest.mock('../../../../../components', () => ({
  Icon: (props: { icon: string }): ReactElement => <span>{props.icon}</span>,
}));

jest.mock('@gravity-ui/icons', () => ({
  FileCode: (): ReactElement => <span>file-icon</span>,
  VolumeLow: (): ReactElement => <span>audio-icon</span>,
  Picture: (): ReactElement => <span>texture-icon</span>,
  Font: (): ReactElement => <span>bitmap-font-icon</span>,
}));

jest.mock('../../tree/render-folder-icon', () => ({
  renderFolderIcon: (): ReactElement => <span>folder-icon</span>,
}));

import type { ExplorerDataNode } from '../../../../../../types/tree-node';
import { parseAssets, getInspectedKey, getSelectedPaths } from '../utils';

const assets: AssetConfig[] = [
  { id: 'a1', name: 'Hero', kind: 'texture', data: {} },
  { id: 'a2', name: 'Coin', kind: 'texture', data: {} },
  { id: 'a3', name: 'Sword', kind: 'item', data: {} },
];

describe('parseAssets', () => {
  it('groups assets by kind into non-selectable folder nodes', () => {
    const nodes = parseAssets(assets);

    expect(nodes.map((node) => node.key)).toEqual([
      'kind:texture',
      'kind:item',
    ]);
    expect(nodes[0].title).toBe('texture');
    expect(nodes[0].selectable).toBe(false);
    expect(typeof nodes[0].icon).toBe('function');
  });

  it('creates asset leaf nodes with the correct path', () => {
    const nodes = parseAssets(assets);
    const textureChildren = (nodes[0].children ?? []) as ExplorerDataNode[];

    expect(textureChildren).toHaveLength(2);
    expect(textureChildren[0].key).toBe('a1');
    expect(textureChildren[0].title).toBe('Hero');
    expect(textureChildren[0].path).toEqual(['assets', 'id:a1']);
    expect(textureChildren[0].isLeaf).toBe(true);
    expect(isValidElement(textureChildren[0].icon)).toBe(true);
  });
});

describe('getInspectedKey / getSelectedPaths', () => {
  it('returns the asset id only for assets paths', () => {
    expect(getInspectedKey(['assets', 'id:a1'])).toBe('a1');
    expect(getInspectedKey(['scenes', 'id:s1'])).toBeUndefined();
    expect(getInspectedKey(undefined)).toBeUndefined();
  });

  it('keeps only assets selection paths', () => {
    expect(
      getSelectedPaths([
        ['assets', 'id:a1'],
        ['scenes', 'id:s1'],
      ]),
    ).toEqual([['assets', 'id:a1']]);
  });
});
