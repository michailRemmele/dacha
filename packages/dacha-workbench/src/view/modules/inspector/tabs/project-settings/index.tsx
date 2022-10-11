import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { Config } from 'remiz'

import { EngineContext } from '../../../../providers'
import {
  Field,
  LabelledSelect,
  Form,
} from '../../components'

export const ProjectSettings: FC = () => {
  const { sceneContext } = useContext(EngineContext)
  const { t } = useTranslation()

  const { loaders, scenes } = sceneContext.data.projectConfig as Config

  const sceneOptions = useMemo(() => scenes.map((scene) => ({
    title: scene.name,
    value: scene.name,
  })), [])

  const loaderOptions = useMemo(() => loaders.map((loader) => ({
    title: loader.name,
    value: loader.name,
  })), [])

  return (
    <Form>
      <Field
        name="startScene"
        component={LabelledSelect}
        label={t('inspector.projectSettings.field.startScene.label')}
        options={sceneOptions}
        allowEmpty
      />
      <Field
        name="startLoader"
        component={LabelledSelect}
        label={t('inspector.projectSettings.field.startLoader.label')}
        options={loaderOptions}
        allowEmpty
      />
    </Form>
  )
}
