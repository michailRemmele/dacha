import React, {
  useEffect,
  useContext,
  useState,
  FC,
} from 'react'

import { EngineContext } from '../engine-provider'
import { useStore } from '../../hooks'
import { includesArray } from '../../../utils/includes-array'
import { EventType } from '../../../events'
import type { InspectEntityEvent } from '../../../events'

import { getEntityType, EntityType } from './get-entity-type'

interface SelectedEntityData {
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
  const [entityData, setEntityData] = useState<SelectedEntityData>({})
  const store = useStore()

  const { scene } = useContext(EngineContext) || {}

  useEffect(() => {
    if (!scene) {
      return () => void 0
    }

    const handleInspectEntity = (event: InspectEntityEvent): void => {
      const { path } = event

      setEntityData({
        path,
        type: getEntityType(path),
      })
      scene.emit(EventType.InspectedEntityChange, {
        path,
      })
    }

    scene.addEventListener(EventType.InspectEntity, handleInspectEntity)

    return (): void => {
      setEntityData({})
      scene.removeEventListener(EventType.InspectEntity, handleInspectEntity)
    }
  }, [scene])

  useEffect(() => {
    const { path } = entityData
    if (store === undefined || path === undefined) {
      return () => {}
    }

    const unsubscribe = store.subscribe((updatedPath) => {
      if (!includesArray(path, updatedPath)) {
        return
      }

      if (store.get(path) === undefined) {
        setEntityData({
          path: undefined,
          type: undefined,
        })
        scene.emit(EventType.InspectedEntityChange, {
          path: undefined,
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [store, entityData.path])

  return (
    <SelectedEntityContext.Provider value={entityData}>
      {children}
    </SelectedEntityContext.Provider>
  )
}
