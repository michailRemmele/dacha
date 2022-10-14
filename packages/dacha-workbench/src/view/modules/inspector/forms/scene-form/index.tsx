import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { Config } from 'remiz'

import { EngineContext } from '../../../../providers'
import {
  Field,
  LabelledTextInput,
  LabelledSelect,
  Form,
} from '../../components'
import type { FormComponentProps } from '../types'

export const SceneForm: FC<FormComponentProps> = ({ path }) => {
  const { sceneContext } = useContext(EngineContext)
  const { t } = useTranslation()

  const { levels } = sceneContext.data.projectConfig as Config

  const levelOptions = useMemo(() => levels.map((level) => ({
    title: level.name,
    value: level.name,
  })), [])

  return (
    <Form>
      <Field
        path={path.concat('name')}
        component={LabelledTextInput}
        label={t('inspector.sceneForm.field.name.label')}
      />
      <Field
        path={path.concat('level')}
        component={LabelledSelect}
        label={t('inspector.sceneForm.field.level.label')}
        options={levelOptions}
        allowEmpty
      />
    </Form>
  )
}
