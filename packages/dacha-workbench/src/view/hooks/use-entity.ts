import { useEffect, useContext, useState } from 'react'
import type { MessageBus } from 'remiz'

import { EngineContext } from '../providers'
import { INSPECT_ENTITY_MSG } from '../../consts/message-types'

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

export const useEntity = (): [unknown | undefined, Array<string> | undefined] => {
  const { sceneContext, messageBusObserver } = useContext(EngineContext)
  const projectConfig = sceneContext.data.projectConfig as Data

  const [entity, setEntity] = useState<unknown | undefined>()
  const [entityPath, setEntityPath] = useState<Array<string> | undefined>()

  useEffect(() => {
    const handleMessageBusUpdate = (messageBus: unknown): void => {
      const messages = (messageBus as MessageBus).get(INSPECT_ENTITY_MSG) || []

      if (messages.length) {
        const { path } = messages[messages.length - 1]

        setEntity(get(projectConfig, (path as Array<string>).slice(0)))
        setEntityPath(path as Array<string>)
      }
    }

    messageBusObserver.subscribe(handleMessageBusUpdate)

    return (): void => messageBusObserver.unsubscribe(handleMessageBusUpdate)
  }, [messageBusObserver, projectConfig])

  return [entity, entityPath]
}
