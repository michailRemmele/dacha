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
import { getSavedSelectedEntity } from '../../../utils/get-saved-selected-entity'
import { EventType } from '../../../events'
import { persistentStorage } from '../../../persistent-storage'
import type { InspectEntityEvent } from '../../../events'

import { getEntityType, EntityType } from './get-entity-type'
import { getLevelId } from './get-level-id'

export interface SelectedEntityData {
  path?: Array<string>
  type?: EntityType
}

interface SelectedEntityProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const SelectedEntityContext = React.createContext<SelectedEntityData>({})

// Provider to store selected entity details and sync selection update to avoid issues
// when entity was deleted but state has not updated yet
export const SelectedEntityProvider: FC<SelectedEntityProviderProps> = ({
  children,
}): JSX.Element => {
  const { scene } = useContext(EngineContext) || {}
  const store = useStore()

  const [entityData, setEntityData] = useState<SelectedEntityData>(() => ({
    path: getSavedSelectedEntity(store),
    type: getEntityType(getSavedSelectedEntity(store)),
  }))
  const selectedLevelRef = useRef<string | undefined>(getSavedSelectedLevelId(store))

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

      persistentStorage.set('selectedEntity', path)
    }

    scene.addEventListener(EventType.InspectEntity, handleInspectEntity)

    return (): void => {
      scene.removeEventListener(EventType.InspectEntity, handleInspectEntity)
    }
  }, [scene])

  useEffect(() => {
    const { path } = entityData
    if (path === undefined || scene === undefined) {
      return () => {}
    }

    const unsubscribe = store.subscribe((updatedPath) => {
      if (!includesArray(path, updatedPath)) {
        return
      }

      if (store.get(path) === undefined) {
        setEntityData({ path: undefined, type: undefined })
        scene.dispatchEvent(EventType.InspectedEntityChange, { path: undefined })

        persistentStorage.set('selectedEntity', undefined)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [scene, store, entityData.path])

  return (
    <SelectedEntityContext.Provider value={entityData}>
      {children}
    </SelectedEntityContext.Provider>
  )
}
