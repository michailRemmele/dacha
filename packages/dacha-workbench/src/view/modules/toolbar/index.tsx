import {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import isEqual from 'lodash.isequal'
import type { RadioChangeEvent } from 'antd'
import { Radio } from 'antd'
import {
  DragOutlined,
  SearchOutlined,
  AimOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { GameObject } from 'remiz'

import { EngineContext } from '../../providers'
import { SELECT_TOOL_MSG, SELECT_LEVEL_MSG } from '../../../consts/message-types'
import { Tool, ToolController } from '../../../engine/components'
import type { FeatureValue } from '../../../engine/components/tool'

import { features } from './components'
import { ToolbarStyled, ToolGroupCSS } from './toolbar.style'

export const Toolbar: FC = () => {
  const { t } = useTranslation()
  const {
    pushMessage,
    gameObjectObserver,
    gameStateObserver,
    sceneContext,
    messageBus,
  } = useContext(EngineContext)

  const mainObjectId = useMemo<string>(
    () => (sceneContext.data.mainObject as GameObject).id,
    [sceneContext],
  )

  const [selectedTool, setSelectedTool] = useState('')
  const [toolFeatures, setToolFeatures] = useState<Record<string, FeatureValue>>({})
  const [disabled, setDisabled] = useState(true)

  const ToolFeatures = useMemo(() => features[selectedTool], [selectedTool])

  useEffect(() => {
    const handleUpdate = (): void => {
      const messages = messageBus.get(SELECT_LEVEL_MSG)
      if (messages?.length) {
        setDisabled(false)
      }

      const mainObject = gameObjectObserver.getById(mainObjectId) as GameObject
      const toolController = mainObject.getComponent(ToolController)
      const toolObject = mainObject.getChildById(toolController.activeTool)

      if (!toolObject) {
        return
      }

      const {
        name,
        features: currentFeatures,
      } = toolObject.getComponent(Tool)

      if (name !== selectedTool) {
        setSelectedTool(name)
      }

      const featuresValues = Object.keys(currentFeatures).reduce((acc, key) => {
        acc[key] = currentFeatures[key].value
        return acc
      }, {} as Record<string, FeatureValue>)

      if (!isEqual(featuresValues, toolFeatures)) {
        setToolFeatures(featuresValues)
      }
    }

    gameStateObserver.subscribe(handleUpdate)

    return () => gameStateObserver.unsubscribe(handleUpdate)
  }, [
    gameObjectObserver,
    gameStateObserver,
    sceneContext,
    messageBus,
    mainObjectId,
    selectedTool,
    toolFeatures,
  ])

  const handleSelect = useCallback((event: RadioChangeEvent) => {
    pushMessage({
      type: SELECT_TOOL_MSG,
      name: event.target.value,
    })
  }, [pushMessage])

  return (
    <ToolbarStyled>
      <Radio.Group
        css={ToolGroupCSS}
        buttonStyle="solid"
        size="small"
        value={selectedTool}
        onChange={handleSelect}
        disabled={disabled}
      >
        <Radio.Button value="hand">
          <DragOutlined title={t('toolbar.hand.title')} />
        </Radio.Button>
        <Radio.Button value="pointer">
          <AimOutlined title={t('toolbar.pointer.title')} />
        </Radio.Button>
        <Radio.Button value="zoom">
          <SearchOutlined title={t('toolbar.zoom.title')} />
        </Radio.Button>
        <Radio.Button value="template">
          <UserOutlined title={t('toolbar.template.title')} />
        </Radio.Button>
      </Radio.Group>

      {features[selectedTool] && !disabled ? (<ToolFeatures features={toolFeatures} />) : null}
    </ToolbarStyled>
  )
}
