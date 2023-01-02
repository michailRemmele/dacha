import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { LevelConfig } from 'remiz'

import { useMutator } from '../../../../hooks'
import {
  Field,
  LabelledTextInput,
  LabelledSelect,
  Form,
  SystemList,
} from '../../components'
import type { FormComponentProps } from '../types'

export const SceneForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  const levels = useMutator('levels') as Array<LevelConfig>

  const levelOptions = useMemo(() => levels.map((level) => ({
    title: level.name,
    value: level.name,
  })), [levels])

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

      <SystemList />
    </Form>
  )
}
