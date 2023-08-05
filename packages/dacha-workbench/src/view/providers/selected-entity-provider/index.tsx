import React, {
  useEffect,
  useContext,
  useState,
  FC,
} from 'react'
import type { MessageBus } from 'remiz'

import { EngineContext } from '../engine-provider'
import { INSPECT_ENTITY_MSG, INSPECTED_ENTITY_CHANGE_MSG } from '../../../consts/message-types'
import { useStore } from '../../hooks'
import { includesArray } from '../../../utils/includes-array'
import type { InspectEntityMessage } from '../../../types/messages'

import { getEntityType, EntityType } from './get-entity-type'

interface SelectedEntityData {
  path?: Array<string>
  type?: EntityType
}

interface SelectedEntityProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const SelectedEntityContext = React.createContext<SelectedEntityData>({})

export const SelectedEntityProvider: FC<SelectedEntityProviderProps> = ({
  children,
}): JSX.Element => {
  const [entityData, setEntityData] = useState<SelectedEntityData>({})
  const store = useStore()

  const { messageBusObserver, pushMessage } = useContext(EngineContext) || {}

  useEffect(() => {
    if (!messageBusObserver) {
      return () => void 0
    }

    const handleMessageBusUpdate = (messageBus: unknown): void => {
      const messages = ((messageBus as MessageBus)
        .get(INSPECT_ENTITY_MSG) || []) as Array<InspectEntityMessage>

      if (messages.length) {
        const { path } = messages[messages.length - 1]

        setEntityData({
          path,
          type: getEntityType(path),
        })
        pushMessage({
          type: INSPECTED_ENTITY_CHANGE_MSG,
          path,
        })
      }
    }

    messageBusObserver.subscribe(handleMessageBusUpdate)

    return (): void => {
      setEntityData({})
      messageBusObserver.unsubscribe(handleMessageBusUpdate)
    }
  }, [messageBusObserver])

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
        pushMessage({
          type: INSPECTED_ENTITY_CHANGE_MSG,
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
