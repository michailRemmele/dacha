import React, { useContext, useEffect, useState } from 'react'
import type { MessageBus } from 'remiz'

import { EngineContext } from '../../providers'

import './style.less'

const INSPECT_ENTITY_MSG = 'INSPECT_ENTITY'

type DataValue = string | number | boolean

interface DataNode {
  [key: string]: DataNode | Array<DataNode> | DataValue
}

type Data = DataNode | Array<DataNode> | DataValue

const get = (data: Data, path: Array<string>): unknown => {
  const key = path.shift()

  if (!key) {
    return data
  }

  if (Array.isArray(data)) {
    const node = data.find((item) => item.name === key)

    if (node) {
      return get(node, path)
    }
  } else if (typeof data === 'object') {
    return get(data[key], path)
  }

  return void 0
}

export const Inspector = (): JSX.Element => {
  const { sceneContext, messageBusObserver } = useContext(EngineContext)
  const projectConfig = sceneContext.data.projectConfig as Data

  const [entity, setEntity] = useState<unknown>('')

  useEffect(() => {
    const handleMessageBusUpdate = (messageBus: unknown): void => {
      const messages = (messageBus as MessageBus).get(INSPECT_ENTITY_MSG) || []

      if (messages.length) {
        const { path } = messages[messages.length - 1]

        setEntity(get(projectConfig, path as Array<string>))
      }
    }

    messageBusObserver.subscribe(handleMessageBusUpdate)

    return () => messageBusObserver.unsubscribe(handleMessageBusUpdate)
  }, [messageBusObserver, projectConfig])

  return (
    <div className="inspector">
      {typeof entity === 'object' ? JSON.stringify(entity) : String(entity)}
    </div>
  )
}
