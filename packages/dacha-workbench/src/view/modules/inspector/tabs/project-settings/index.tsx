import {
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import type { SceneConfig } from 'remiz'

import { useConfig, useSaveProject } from '../../../../hooks'
import { NotificationContext } from '../../../../providers'
import {
  Field,
  LabelledSelect,
  Form,
  MultiField,
} from '../../components'

const ReloadButton: FC = () => {
  const { t } = useTranslation()
  const { save } = useSaveProject()

  const handleReload = useCallback(() => {
    save()
    window.location.reload()
  }, [])
  return (
    <Button onClick={handleReload}>
      {t('inspector.projectSettings.reload.button.title')}
    </Button>
  )
}

export const ProjectSettings: FC = () => {
  const { t } = useTranslation()
  const notificationApi = useContext(NotificationContext)

  const loaders = useConfig('loaders') as Array<SceneConfig>
  const scenes = useConfig('scenes') as Array<SceneConfig>
  const globalOptions = useConfig('globalOptions')

  const prevGlobalOptions = useRef(globalOptions)

  useEffect(() => {
    if (globalOptions === prevGlobalOptions.current) {
      return
    }

    notificationApi.warning({
      key: 'reload-warning-notification',
      message: t('inspector.projectSettings.reload.message'),
      description: t('inspector.projectSettings.reload.description'),
      placement: 'bottomRight',
      btn: <ReloadButton />,
      duration: 0,
    })
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
