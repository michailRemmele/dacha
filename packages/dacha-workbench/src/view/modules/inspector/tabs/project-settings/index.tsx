import {
  useMemo,
  useEffect,
  useRef,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { SceneConfig } from 'dacha'

import { useConfig } from '../../../../hooks'
import { NeedsReloadContext } from '../../../../providers'
import {
  Field,
  LabelledSelect,
  Form,
} from '../../components'
import {
  SortingWidget,
  AudioGroupsWidget,
  PerformanceWidget,
} from '../../widgets/global-options'

export const ProjectSettings: FC = () => {
  const { t } = useTranslation()

  const scenes = useConfig('scenes') as SceneConfig[]
  const globalOptions = useConfig('globalOptions')

  const prevGlobalOptions = useRef(globalOptions)

  const { setNeedsReload } = useContext(NeedsReloadContext)

  useEffect(() => {
    if (globalOptions === prevGlobalOptions.current) {
      return
    }

    setNeedsReload(true)
    prevGlobalOptions.current = globalOptions
  }, [globalOptions])

  const sceneOptions = useMemo(() => scenes.map((scene) => ({
    title: scene.name,
    value: scene.id,
  })), [scenes])

  return (
    <Form>
      <Field
        path={['startSceneId']}
        component={LabelledSelect}
        label={t('inspector.projectSettings.field.startScene.label')}
        options={sceneOptions}
        allowEmpty
      />
      <div>
        {t('inspector.projectSettings.globalOptions.title')}
      </div>

      <PerformanceWidget />
      <SortingWidget />
      <AudioGroupsWidget />
    </Form>
  )
}
