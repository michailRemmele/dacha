import { v4 as uuidv4 } from 'uuid'
import type { TemplateConfig, LevelConfig } from 'dacha'

import type { ExplorerEntity } from '../../../types/explorer-entity'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'
import { getUniqueName } from '../../../utils/get-unique-name'
import { getIdByPath } from '../../../utils/get-id-by-path'
import { addValues, setValue, deleteByPaths } from '..'

import { getUpdatedLevels, filterLevels } from './utils'

const updateIds = (template: TemplateConfig): void => {
  template.id = uuidv4()
  template.children?.forEach(updateIds)
}

const getDuplicate = (template: TemplateConfig, parent: TemplateConfig[]): TemplateConfig => {
  const duplicate = structuredClone(template)
  duplicate.name = getUniqueName(duplicate.name, parent as ExplorerEntity[])
  updateIds(duplicate)

  return duplicate
}

export const moveByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const destination = getState(destinationPath)
  if (!Array.isArray(destination)) {
    return
  }

  const { values } = sourcePaths.reduce((acc, path) => {
    const value = getState(path)
    if (value) {
      const duplicate = getDuplicate(value as TemplateConfig, acc.parent)

      acc.values.push(duplicate)
      acc.parent.push(duplicate)
    }
    return acc
  }, { values: [] as TemplateConfig[], parent: destination.slice(0) as TemplateConfig[] })

  if (!values.length) {
    return
  }

  dispatch(addValues(destinationPath, values))

  let levels = getState(['levels']) as LevelConfig[]

  if (destinationPath.at(-1) === 'children') {
    const parentTemplateId = getIdByPath(destinationPath.slice(0, -1))
    levels = getUpdatedLevels(levels, parentTemplateId, values)
  }

  const templateIds = new Set(sourcePaths.map((path) => getIdByPath(path)))
  levels = filterLevels(levels, templateIds)

  dispatch(setValue(['levels'], levels, true))
  dispatch(deleteByPaths(sourcePaths, true))
}
