import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { RadioChangeEvent } from 'antd'
import { Radio } from 'antd'
import { DragOutlined, SearchOutlined } from '@ant-design/icons'
import type { GameObject } from 'remiz'

import type { Tool } from '../../../engine/components'
import { EngineContext } from '../../providers'
import { SELECT_TOOL_MSG } from '../../../consts/message-types'

import { features } from './components'
import './style.less'

const TOOL_COMPONENT_NAME = 'tool'

export const Toolbar: FC = () => {
  const { t } = useTranslation()
  const { pushMessage, gameObjects, sceneContext } = useContext(EngineContext)

  const mainObjectId = useMemo<string>(
    () => (sceneContext.data.mainObject as GameObject).id,
    [sceneContext],
  )

  const [selectedTool, setSelectedTool] = useState('')

  const ToolFeatures = useMemo(() => features[selectedTool], [selectedTool])

  useEffect(() => {
    const handleUpdate = (gameObject: unknown): void => {
      const mainObject = gameObject as GameObject
      const toolObjectId = sceneContext.data.currentToolObjectId as string

      const toolObject = mainObject.getChildById(toolObjectId)

      if (!toolObject) {
        return
      }

      const { name } = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool

      if (name !== selectedTool) {
        setSelectedTool(name)
      }
    }

    gameObjects.subscribe(handleUpdate, mainObjectId)

    return () => gameObjects.unsubscribe(handleUpdate, mainObjectId)
  }, [gameObjects, sceneContext, mainObjectId, selectedTool])

  const handleSelect = useCallback((event: RadioChangeEvent) => {
    pushMessage({
      type: SELECT_TOOL_MSG,
      name: event.target.value,
    })
  }, [pushMessage])

  return (
    <div className="toolbar">
      <Radio.Group
        buttonStyle="solid"
        size="small"
        value={selectedTool}
        onChange={handleSelect}
      >
        <Radio.Button value="hand">
          <DragOutlined title={t('toolbar.hand.title')} />
        </Radio.Button>
        <Radio.Button value="zoom">
          <SearchOutlined title={t('toolbar.zoom.title')} />
        </Radio.Button>
      </Radio.Group>

      {features[selectedTool] ? (<ToolFeatures />) : null}
    </div>
  )
}
