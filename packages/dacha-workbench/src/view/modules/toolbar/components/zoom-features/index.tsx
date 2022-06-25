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
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import type { GameObject } from 'remiz'

import type { Tool } from '../../../../../engine/components'
import { EngineContext } from '../../../../providers'
import { SET_TOOL_FEATURE_VALUE_MSG } from '../../../../../consts/message-types'

const TOOL_COMPONENT_NAME = 'tool'

export const ZoomFeatures: FC = () => {
  const { t } = useTranslation()
  const { pushMessage, gameObjects, sceneContext } = useContext(EngineContext)

  const mainObjectId = useMemo<string>(
    () => (sceneContext.data.mainObject as GameObject).id,
    [sceneContext],
  )

  const [values, setValues] = useState<Record<string, string>>({
    direction: '',
  })

  useEffect(() => {
    const handleUpdate = (gameObject: unknown): void => {
      const mainObject = gameObject as GameObject
      const toolObjectId = sceneContext.data.currentToolObjectId as string

      const toolObject = mainObject.getChildById(toolObjectId)

      if (!toolObject) {
        return
      }

      const { features } = toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool

      Object.keys(features).forEach((name) => {
        if (values[name] !== features[name].value) {
          setValues({
            ...values,
            [name]: features[name].value,
          })
        }
      })
    }

    gameObjects.subscribe(handleUpdate, mainObjectId)

    return () => gameObjects.unsubscribe(handleUpdate, mainObjectId)
  }, [gameObjects, sceneContext, mainObjectId, values])

  const handleSelect = useCallback((event: RadioChangeEvent) => {
    pushMessage({
      type: SET_TOOL_FEATURE_VALUE_MSG,
      name: event.target.name,
      value: event.target.value,
    })
  }, [pushMessage])

  return (
    <div className="tool-features">
      <Radio.Group
        name="direction"
        buttonStyle="solid"
        size="small"
        value={values.direction}
        onChange={handleSelect}
      >
        <Radio.Button value="in">
          <ZoomInOutlined title={t('zoom.features.direction.in.title')} />
        </Radio.Button>
        <Radio.Button value="out">
          <ZoomOutOutlined title={t('zoom.features.direction.out.title')} />
        </Radio.Button>
      </Radio.Group>
    </div>
  )
}
