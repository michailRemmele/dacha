import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  FC,
} from 'react'
import type { LevelConfig } from 'dacha'

import { EngineContext } from '../engine-provider'
import { useStore, useConfig } from '../../hooks'
import { includesArray } from '../../../utils/includes-array'
import { getSavedSelectedLevelId } from '../../../utils/get-saved-selected-level-id'
import { getSavedInspectedEntity } from '../../../utils/get-saved-inspected-entity'
import { getSavedEntitySelection } from '../../../utils/get-saved-entity-selection'
import { EventType } from '../../../events'
import { persistentStorage } from '../../../persistent-storage'
import type { InspectEntityEvent, SelectEntitiesEvent } from '../../../events'

import { getEntityType, EntityType } from './get-entity-type'
import { getLevelId } from './get-level-id'

export interface InspectedEntity {
  path?: Array<string>
  type?: EntityType
}

interface EntityExplorerProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const InspectedEntityContext = React.createContext<InspectedEntity>({})

export interface EntitySelection {
  paths: string[][]
}

export const EntitySelectionContext = React.createContext<EntitySelection>({ paths: [] })

// Provider to store selected entity details and sync selection update to avoid issues
// when entity was deleted but state has not updated yet
export const EntityExplorerProvider: FC<EntityExplorerProviderProps> = ({
  children,
}): JSX.Element => {
  const { scene } = useContext(EngineContext) || {}
  const store = useStore()

  const [entityData, setEntityData] = useState<InspectedEntity>(() => ({
    path: getSavedInspectedEntity(store),
    type: getEntityType(getSavedInspectedEntity(store)),
  }))
  const selectedLevelRef = useRef<string | undefined>(getSavedSelectedLevelId(store))

  const [entitySelection, setEntitySelection] = useState<EntitySelection>(() => ({
    paths: getSavedEntitySelection(store),
  }))

  const levels = useConfig('levels') as Array<LevelConfig> | undefined

  useEffect(() => {
    if (scene === undefined || levels === undefined) {
      return
    }

    const isDeleted = levels.every((level) => level.id !== selectedLevelRef.current)
    if (isDeleted) {
      scene.dispatchEvent(EventType.SelectLevel, { levelId: undefined })
      selectedLevelRef.current = undefined
      persistentStorage.set('selectedLevel', undefined)
    }
  }, [scene, levels])

  useEffect(() => {
    if (!scene) {
      return () => void 0
    }

    const handleInspectEntity = (event: InspectEntityEvent): void => {
      const { path } = event

      const levelId = getLevelId(path)
      if (levelId !== undefined && levelId !== selectedLevelRef.current) {
        scene.dispatchEvent(EventType.SelectLevel, { levelId })
        selectedLevelRef.current = levelId
        persistentStorage.set('selectedLevel', levelId)
      }

      setEntityData({ path, type: getEntityType(path) })
      scene.dispatchEvent(EventType.InspectedEntityChange, { path })

      persistentStorage.set('inspectedEntity', path)
    }

    scene.addEventListener(EventType.InspectEntity, handleInspectEntity)

    return (): void => {
      scene.removeEventListener(EventType.InspectEntity, handleInspectEntity)
    }
  }, [scene])

  useEffect(() => {
    if (!scene) {
      return () => void 0
    }

    const handleSelectEntities = (event: SelectEntitiesEvent): void => {
      setEntitySelection({ paths: event.paths })
      persistentStorage.set('entitySelection', event.paths)

      scene.dispatchEvent(EventType.SelectEntitiesChange, { paths: event.paths })
    }

    scene.addEventListener(EventType.SelectEntities, handleSelectEntities)

    return (): void => {
      scene.removeEventListener(EventType.SelectEntities, handleSelectEntities)
    }
  }, [scene])

  useEffect(() => {
    if (scene === undefined) {
      return () => {}
    }

    const unsubscribe = store.subscribe((updatedPath) => {
      const newSelection = entitySelection.paths.filter((path) => {
        if (!includesArray(path, updatedPath)) {
          return true
        }
        return store.get(path) !== undefined
      })

      if (entitySelection.paths.length !== newSelection.length) {
        setEntitySelection({ paths: newSelection })
        scene.dispatchEvent(EventType.SelectEntitiesChange, { paths: newSelection })
        persistentStorage.set('entitySelection', newSelection)
      }

      const { path } = entityData
      if (!path || !includesArray(path, updatedPath)) {
        return
      }

      if (store.get(path) === undefined) {
        const newPath = newSelection.at(-1)
        setEntityData({ path: newPath, type: getEntityType(newPath) })
        scene.dispatchEvent(EventType.InspectedEntityChange, { path: newPath })
        persistentStorage.set('inspectedEntity', newPath)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [scene, store, entitySelection, entityData.path])

  return (
    <EntitySelectionContext.Provider value={entitySelection}>
      <InspectedEntityContext.Provider value={entityData}>
        {children}
      </InspectedEntityContext.Provider>
    </EntitySelectionContext.Provider>
  )
}
