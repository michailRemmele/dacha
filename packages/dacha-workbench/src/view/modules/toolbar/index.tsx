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
  Hand,
  Magnifier,
  HandPointUp,
  Person,
} from '@gravity-ui/icons'
import { Icon } from '../../components'
import type { Actor } from 'dacha'

import { EngineContext } from '../../providers'
import { Tool, ToolController } from '../../../engine/components'
import type { FeatureValue } from '../../../engine/components/tool'
import { EventType } from '../../../events'
import { useStore } from '../../hooks/use-store'
import type { SelectSceneEvent } from '../../../events'
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id'

import { features } from './components'
import styles from './toolbar.module.css'

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
    <div className={styles.toolbar}>
      <Radio.Group
        className={styles.toolGroup}
        buttonStyle="solid"
        value={selectedTool}
        onChange={handleSelect}
        disabled={disabled}
      >
        <Radio.Button value="hand">
          <Icon title={t('toolbar.hand.title')} icon={<Hand />} />
        </Radio.Button>
        <Radio.Button value="pointer">
          <Icon title={t('toolbar.pointer.title')} icon={<HandPointUp />} />
        </Radio.Button>
        <Radio.Button value="zoom">
          <Icon title={t('toolbar.zoom.title')} icon={<Magnifier />} />
        </Radio.Button>
        <Radio.Button value="template">
          <Icon title={t('toolbar.template.title')} icon={<Person />} />
        </Radio.Button>
      </Radio.Group>

      {features[selectedTool] && !disabled ? (<ToolFeatures features={toolFeatures} />) : null}
    </div>
  )
}
