import { toKebabCase } from '../../../../../utils/to-kebab-case'

import type { EntityType } from './types'

export const getFileName = (name: string, type: EntityType): string => {
  if (!name) {
    return ''
  }

  return `${toKebabCase(name)}.${type}.ts`
}

export const getFilePath = (
  root: string,
  subdirectory: string,
  filename: string,
): string => {
  const formattedRoot = root.endsWith('/') ? root.slice(0, -1) : root
  return [formattedRoot, subdirectory, filename].filter(Boolean).join('/')
}

const ENTITY_DEFAULT_FOLDER_MAP: Record<EntityType, string> = {
  system: 'systems',
  component: 'components',
  behavior: 'behaviors',
}

export const getDefaultDirectory = (type: EntityType): string => {
  const { contextRoot } = window.electron.getEditorConfig()

  const formattedRoot = contextRoot.endsWith('/') ? contextRoot.slice(0, -1) : contextRoot

  return [formattedRoot, ENTITY_DEFAULT_FOLDER_MAP[type]].filter(Boolean).join('/')
}
