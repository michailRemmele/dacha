import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { Config } from 'remiz'

import { EngineContext } from '../../../../providers'
import {
  Field,
  LabelledTextInput,
  LabelledSelect,
} from '../../components'

import './style.less'

export const SceneForm: FC = () => {
  const { sceneContext } = useContext(EngineContext)
  const { t } = useTranslation()

  const { levels } = sceneContext.data.projectConfig as Config

  const levelOptions = useMemo(() => levels.map((level) => ({
    title: level.name,
    value: level.name,
  })), [])

  return (
    <div className="scene-form">
      <Field
        name="name"
        component={LabelledTextInput}
        label={t('inspector.sceneForm.field.name.label')}
      />
      <Field
        name="level"
        component={LabelledSelect}
        label={t('inspector.sceneForm.field.level.label')}
        options={levelOptions}
        allowEmpty
      />
    </div>
  )
}
