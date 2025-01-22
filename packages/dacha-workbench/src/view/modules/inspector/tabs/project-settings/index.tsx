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
  MultiField,
} from '../../components'

export const ProjectSettings: FC = () => {
  const { t } = useTranslation()

  const loaders = useConfig('loaders') as Array<SceneConfig>
  const scenes = useConfig('scenes') as Array<SceneConfig>
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

  const loaderOptions = useMemo(() => loaders.map((loader) => ({
    title: loader.name,
    value: loader.id,
  })), [loaders])

  return (
    <Form>
      <Field
        path={['startSceneId']}
        component={LabelledSelect}
        label={t('inspector.projectSettings.field.startScene.label')}
        options={sceneOptions}
        allowEmpty
      />
      <Field
        path={['startLoaderId']}
        component={LabelledSelect}
        label={t('inspector.projectSettings.field.startLoader.label')}
        options={loaderOptions}
        allowEmpty
      />
      <div>
        {t('inspector.projectSettings.globalOptions.title')}
      </div>
      <MultiField
        path={['globalOptions']}
      />
    </Form>
  )
}
