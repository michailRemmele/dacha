import type { TemplateConfig } from 'dacha';
import { Box } from '@gravity-ui/icons';

import { ExplorerDataNode } from '../../../../../types/tree-node';
import { getIdByPath } from '../../../../../utils/get-id-by-path';
import { Icon } from '../../../../components';

const parseTemplate = (
  template: TemplateConfig,
  path: string[],
  parent?: ExplorerDataNode,
): ExplorerDataNode => {
  const isLeaf = !template?.children?.length;
  const templatePath = path.concat(`id:${template.id}`);

  const node: ExplorerDataNode = {
    key: template.id,
    title: template.name,
    path: templatePath,
    parent,
    icon: <Icon icon={<Box />} />,
    isLeaf,
  };

  if (!isLeaf) {
    const childPath = templatePath.concat('children');
    node.children = template.children?.map((child) =>
      parseTemplate(child, childPath, node),
    );
  }

  return node;
};

export const parseTemplates = (
  templates: TemplateConfig[],
): ExplorerDataNode[] =>
  templates.map((template) => parseTemplate(template, ['templates']));

export const getInspectedKey = (path?: string[]): string | undefined => {
  if (!path || path[0] !== 'templates') {
    return void '';
  }

  return getIdByPath(path);
};

export const getSelectedPaths = (paths: string[][]): string[][] =>
  paths.filter((path) => path[0] === 'templates');
