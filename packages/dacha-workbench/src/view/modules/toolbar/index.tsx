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
import type { Actor } from 'dacha'

import { EngineContext } from '../../providers'
import { Tool, ToolController } from '../../../engine/components'
import type { FeatureValue } from '../../../engine/components/tool'
import { EventType } from '../../../events'
import { useStore } from '../../hooks/use-store'
import type { SelectSceneEvent } from '../../../events'
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id'

import { features } from './components'
import { ToolbarStyled, ToolGroupCSS } from './toolbar.style'

export const Toolbar: FC = () => {
  const { t } = useTranslation()
  const { world } = useContext(EngineContext)
  const store = useStore()

  const [selectedTool, setSelectedTool] = useState('')
  const [toolFeatures, setToolFeatures] = useState<Record<string, FeatureValue>>({})
  const [disabled, setDisabled] = useState(() => !getSavedSelectedSceneId(store))

  const ToolFeatures = useMemo(() => features[selectedTool], [selectedTool])

  useEffect(() => {
    const handleSelectScene = (event: SelectSceneEvent): void => {
      setDisabled(event.sceneId === undefined)
    }

    const handleToolUpdated = (): void => {
      const mainActor = world.data.mainActor as Actor
      const toolController = mainActor.getComponent(ToolController)
      const toolActor = mainActor.findChildById(toolController.activeTool)

      if (!toolActor) {
        return
      }

      const {
        name,
        features: currentFeatures,
      } = toolActor.getComponent(Tool)

      setSelectedTool((prev) => (name !== prev ? name : prev))

      const featuresValues = Object.keys(currentFeatures).reduce((acc, key) => {
        acc[key] = currentFeatures[key].value
        return acc
      }, {} as Record<string, FeatureValue>)

      setToolFeatures((prev) => (!isEqual(featuresValues, prev) ? featuresValues : prev))
    }

    handleToolUpdated()

    world.addEventListener(EventType.SelectScene, handleSelectScene)
    world.addEventListener(EventType.ToolUpdated, handleToolUpdated)

    return (): void => {
      world.removeEventListener(EventType.SelectScene, handleSelectScene)
      world.removeEventListener(EventType.ToolUpdated, handleToolUpdated)
    }
  }, [world])

  const handleSelect = useCallback((event: RadioChangeEvent) => {
    world.dispatchEvent(EventType.SelectTool, {
      name: event.target.value as string,
    })
  }, [world])

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
