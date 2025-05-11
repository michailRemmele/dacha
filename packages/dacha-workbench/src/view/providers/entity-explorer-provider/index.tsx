import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  FC,
} from 'react'
import type { SceneConfig, UIOptions } from 'dacha'

import { EngineContext } from '../engine-provider'
import { useStore, useConfig } from '../../hooks'
import { includesArray } from '../../../utils/includes-array'
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id'
import { getSavedInspectedEntity } from '../../../utils/get-saved-inspected-entity'
import { getSavedEntitySelection } from '../../../utils/get-saved-entity-selection'
import { EventType } from '../../../events'
import { persistentStorage } from '../../../persistent-storage'
import type { InspectEntityEvent, SelectEntitiesEvent } from '../../../events'

import { getEntityType, EntityType } from './get-entity-type'
import { getSceneId } from './get-scene-id'

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
  const { world } = useContext(EngineContext) as UIOptions | undefined ?? {}
  const store = useStore()

  const [entityData, setEntityData] = useState<InspectedEntity>(() => ({
    path: getSavedInspectedEntity(store),
    type: getEntityType(getSavedInspectedEntity(store)),
  }))
  const selectedSceneRef = useRef<string | undefined>(getSavedSelectedSceneId(store))

  const [entitySelection, setEntitySelection] = useState<EntitySelection>(() => ({
    paths: getSavedEntitySelection(store),
  }))

  const scenes = useConfig('scenes') as SceneConfig[] | undefined

  useEffect(() => {
    if (world === undefined || scenes === undefined) {
      return
    }

    const isDeleted = scenes.every((scene) => scene.id !== selectedSceneRef.current)
    if (isDeleted) {
      world.dispatchEvent(EventType.SelectScene, { sceneId: undefined })
      selectedSceneRef.current = undefined
      persistentStorage.set('selectedScene', undefined)
    }
  }, [world, scenes])

  useEffect(() => {
    if (!world) {
      return () => void 0
    }

    const handleInspectEntity = (event: InspectEntityEvent): void => {
      const { path } = event

      const sceneId = getSceneId(path)
      if (sceneId !== undefined && sceneId !== selectedSceneRef.current) {
        world.dispatchEvent(EventType.SelectScene, { sceneId })
        selectedSceneRef.current = sceneId
        persistentStorage.set('selectedScene', sceneId)
      }

      setEntityData({ path, type: getEntityType(path) })
      world.dispatchEvent(EventType.InspectedEntityChange, { path })

      persistentStorage.set('inspectedEntity', path)
    }

    world.addEventListener(EventType.InspectEntity, handleInspectEntity)

    return (): void => {
      world.removeEventListener(EventType.InspectEntity, handleInspectEntity)
    }
  }, [world])

  useEffect(() => {
    if (!world) {
      return () => void 0
    }

    const handleSelectEntities = (event: SelectEntitiesEvent): void => {
      setEntitySelection({ paths: event.paths })
      persistentStorage.set('entitySelection', event.paths)

      world.dispatchEvent(EventType.SelectEntitiesChange, { paths: event.paths })
    }

    world.addEventListener(EventType.SelectEntities, handleSelectEntities)

    return (): void => {
      world.removeEventListener(EventType.SelectEntities, handleSelectEntities)
    }
  }, [world])

  useEffect(() => {
    if (world === undefined) {
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
        world.dispatchEvent(EventType.SelectEntitiesChange, { paths: newSelection })
        persistentStorage.set('entitySelection', newSelection)
      }

      const { path } = entityData
      if (!path || !includesArray(path, updatedPath)) {
        return
      }

      if (store.get(path) === undefined) {
        const newPath = newSelection.at(-1)
        setEntityData({ path: newPath, type: getEntityType(newPath) })
        world.dispatchEvent(EventType.InspectedEntityChange, { path: newPath })
        persistentStorage.set('inspectedEntity', newPath)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [world, store, entitySelection, entityData.path])

  return (
    <EntitySelectionContext.Provider value={entitySelection}>
      <InspectedEntityContext.Provider value={entityData}>
        {children}
      </InspectedEntityContext.Provider>
    </EntitySelectionContext.Provider>
  )
}
