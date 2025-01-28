import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  FC,
} from 'react'

import { useConfig } from '../../../../../../../../hooks'
import { getStatePath, getSubstatePath } from '../../utils/paths'
import type { SelectedEntity } from '../../types'

import { getEntityType } from './get-entity-type'

interface AnimationEditorData {
  path: Array<string>
  selectedEntity?: SelectedEntity
  selectEntity: (path: string[]) => void
}

interface AnimationEditorProviderProps {
  path: Array<string>
  children: JSX.Element | Array<JSX.Element>
}

export const AnimationEditorContext = createContext<AnimationEditorData>({
  path: [],
  selectEntity: () => void 0,
})

export const AnimationEditorProvider: FC<AnimationEditorProviderProps> = ({
  path,
  children,
}): JSX.Element => {
  const [selectedEntity, setEntity] = useState<SelectedEntity | undefined>()

  const entity = useConfig(selectedEntity?.path)

  // Reset selection if entry was deleted from config
  useEffect(() => {
    if (entity === undefined && selectedEntity !== undefined) {
      const substatePath = getSubstatePath(selectedEntity.path)
      const statePath = getStatePath(selectedEntity.path)
      const newEntityPath = substatePath ?? statePath
      const newEntityType = getEntityType(newEntityPath)

      setEntity(
        newEntityPath && newEntityType
          ? { path: newEntityPath, type: newEntityType }
          : undefined,
      )
    }
  }, [entity])

  const selectEntity = useCallback((entityPath: string[]) => {
    const type = getEntityType(entityPath)
    setEntity(type ? { path: entityPath, type } : undefined)
  }, [])

  const entityData = useMemo(() => ({
    path,
    selectedEntity,
    selectEntity,
  }), [path, selectedEntity, selectEntity])

  return (
    <AnimationEditorContext.Provider value={entityData}>
      {children}
    </AnimationEditorContext.Provider>
  )
}
