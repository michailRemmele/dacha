import { toKebabCase } from '../../../../../utils/to-kebab-case';
import { pluralize } from '../../../../../utils/pluralize';

export const getFileName = (name: string, type: string): string => {
  if (!name) {
    return '';
  }

  return `${toKebabCase(name)}.${toKebabCase(type)}.ts`;
};

export const getFilePath = (
  root: string,
  subdirectory: string,
  filename: string,
): string => {
  const formattedRoot = root.endsWith('/') ? root.slice(0, -1) : root;
  return [formattedRoot, subdirectory, filename].filter(Boolean).join('/');
};

export const getDefaultDirectory = (type: string): string => {
  const { contextRoot } = window.electron.getEditorConfig();

  const formattedRoot = contextRoot.endsWith('/')
    ? contextRoot.slice(0, -1)
    : contextRoot;

  return [formattedRoot, toKebabCase(pluralize(type))]
    .filter(Boolean)
    .join('/');
};
