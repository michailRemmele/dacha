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
import type { SelectLevelEvent } from '../../../events'
import { getSavedSelectedLevelId } from '../../../utils/get-saved-selected-level-id'

import { features } from './components'
import { ToolbarStyled, ToolGroupCSS } from './toolbar.style'

export const Toolbar: FC = () => {
  const { t } = useTranslation()
  const {
    scene,
    gameStateObserver,
  } = useContext(EngineContext)
  const store = useStore()

  const mainActorId = useMemo<string>(
    () => (scene.data.mainActor as Actor).id,
    [scene],
  )

  const [selectedTool, setSelectedTool] = useState('')
  const [toolFeatures, setToolFeatures] = useState<Record<string, FeatureValue>>({})
  const [disabled, setDisabled] = useState(() => !getSavedSelectedLevelId(store))

  const ToolFeatures = useMemo(() => features[selectedTool], [selectedTool])

  useEffect(() => {
    const handleSelectLevel = (event: SelectLevelEvent): void => {
      setDisabled(event.levelId === undefined)
    }

    const handleUpdate = (): void => {
      const mainActor = scene.getEntityById(mainActorId) as Actor
      const toolController = mainActor.getComponent(ToolController)
      const toolActor = mainActor.getEntityById(toolController.activeTool)

      if (!toolActor) {
        return
      }

      const {
        name,
        features: currentFeatures,
      } = toolActor.getComponent(Tool)

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

    scene.addEventListener(EventType.SelectLevel, handleSelectLevel)
    gameStateObserver.subscribe(handleUpdate)

    return () => {
      scene.removeEventListener(EventType.SelectLevel, handleSelectLevel)
      gameStateObserver.unsubscribe(handleUpdate)
    }
  }, [
    scene,
    gameStateObserver,
    mainActorId,
    selectedTool,
    toolFeatures,
  ])

  const handleSelect = useCallback((event: RadioChangeEvent) => {
    scene.dispatchEvent(EventType.SelectTool, {
      name: event.target.value as string,
    })
  }, [scene])

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
