import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  FC,
} from 'react'

import { useStore } from '../../../../../../../../hooks'
import { includesArray } from '../../../../../../../../../utils/includes-array'
import type { InspectedEntity } from '../../types'

import { getEntityType } from './get-entity-type'
import type { EntityType } from './get-entity-type'
import { getParentState } from './get-parent-state'

export interface EntitySelection {
  paths: string[][]
}

interface AnimationEditorData {
  path: string[]
  inspectedEntity?: InspectedEntity
  inspectEntity: (path: string[] | undefined) => void
  selectEntities: (paths: string[][]) => void
  entitySelection: EntitySelection
}

interface AnimationEditorProviderProps {
  path: string[]
  children: JSX.Element | JSX.Element[]
}

export const AnimationEditorContext = createContext<AnimationEditorData>({
  path: [],
  inspectEntity: () => {},
  selectEntities: () => {},
  entitySelection: { paths: [] },
})

export const AnimationEditorProvider: FC<AnimationEditorProviderProps> = ({
  path: rootPath,
  children,
}): JSX.Element => {
  const store = useStore()

  const [inspectedEntity, setInspectedEntity] = useState<InspectedEntity | undefined>()
  const [entitySelection, setEntitySelection] = useState<EntitySelection>(() => ({
    paths: [],
  }))

  useEffect(() => {
    const unsubscribe = store.subscribe((updatedPath) => {
      const newSelection = entitySelection.paths.filter((path) => {
        if (!includesArray(path, updatedPath)) {
          return true
        }
        return store.get(path) !== undefined
      })

      if (entitySelection.paths.length !== newSelection.length) {
        setEntitySelection({ paths: newSelection })
      }

      // Try to pick parent state/substate if new selection is empty
      // Otherwise update selection only if size has been changed
      if (!newSelection.length && entitySelection.paths.length) {
        const newEntityPath = getParentState(inspectedEntity?.path)
        if (newEntityPath) {
          newSelection.push(newEntityPath)
          setEntitySelection({ paths: newSelection })
        }
      }

      const path = inspectedEntity?.path
      if (!path || !includesArray(path, updatedPath)) {
        return
      }

      if (store.get(path) === undefined) {
        const newPath = newSelection.at(-1)
        const newType = getEntityType(newPath)
        setInspectedEntity(
          newPath && newType
            ? { path: newPath, type: newType }
            : undefined,
        )
      }
    })

    return () => {
      unsubscribe()
    }
  }, [store, entitySelection, inspectedEntity])

  const inspectEntity = useCallback((entityPath: string[] | undefined) => {
    // Try to pick parent state/substate if new path is undefined
    if (!entityPath) {
      const newEntityPath = getParentState(inspectedEntity?.path)
      if (newEntityPath) {
        setEntitySelection({ paths: [newEntityPath] })
        setInspectedEntity({
          path: newEntityPath,
          type: getEntityType(newEntityPath) as EntityType,
        })
        return
      }
    }

    const type = getEntityType(entityPath)
    setInspectedEntity(type && entityPath ? { path: entityPath, type } : undefined)
  }, [inspectedEntity])
  const selectEntities = useCallback((paths: string[][]) => {
    setEntitySelection({ paths })
  }, [])

  const entityData = useMemo(() => ({
    path: rootPath,
    inspectedEntity,
    inspectEntity,
    selectEntities,
    entitySelection,
  }), [rootPath, inspectedEntity, inspectEntity, selectEntities, entitySelection])

  return (
    <AnimationEditorContext.Provider value={entityData}>
      {children}
    </AnimationEditorContext.Provider>
  )
}
