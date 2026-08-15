import type { AssetConfig } from 'dacha';
import { FileCode, VolumeLow, Picture, Font } from '@gravity-ui/icons';

import type { ExplorerDataNode } from '../../../../../types/tree-node';
import { getIdByPath } from '../../../../../utils/get-id-by-path';
import { formatWidgetName } from '../../../../../utils/format-widget-name';
import { Icon } from '../../../../components';

import { renderFolderIcon } from '../tree/render-folder-icon';

export const getAssetIcon = (kind: string): JSX.Element => {
  switch (kind) {
    case 'texture':
      return <Icon icon={<Picture />} />;
    case 'audio':
      return <Icon icon={<VolumeLow />} />;
    case 'bitmapFont':
      return <Icon icon={<Font />} />;
    default:
      return <Icon icon={<FileCode />} />;
  }
};

export const parseAssets = (assets: AssetConfig[]): ExplorerDataNode[] => {
  const groups = new Map<string, AssetConfig[]>();

  assets.forEach((asset) => {
    const list = groups.get(asset.kind) ?? [];
    list.push(asset);
    groups.set(asset.kind, list);
  });

  return Array.from(groups.entries()).map(
    ([kind, list]): ExplorerDataNode => ({
      key: `kind:${kind}`,
      title: formatWidgetName(kind),
      path: ['assets'],
      selectable: false,
      icon: renderFolderIcon,
      children: list.map(
        (asset): ExplorerDataNode => ({
          key: asset.id,
          title: asset.name,
          path: ['assets', `id:${asset.id}`],
          icon: getAssetIcon(asset.kind),
          isLeaf: true,
        }),
      ),
    }),
  );
};

export const getInspectedKey = (path?: string[]): string | undefined => {
  if (!path || path[0] !== 'assets') {
    return undefined;
  }
  return getIdByPath(path);
};

export const getSelectedPaths = (paths: string[][]): string[][] =>
  paths.filter((path) => path[0] === 'assets');
