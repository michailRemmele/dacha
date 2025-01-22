import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { LevelConfig } from 'dacha'

import { useConfig } from '../../../../hooks'
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

  const namePath = useMemo(() => path.concat('name'), [path])
  const levelPath = useMemo(() => path.concat('levelId'), [path])

  const levels = useConfig('levels') as Array<LevelConfig>

  const levelOptions = useMemo(() => levels.map((level) => ({
    title: level.name,
    value: level.id,
  })), [levels])

  return (
    <Form>
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.sceneForm.field.name.label')}
      />
      <Field
        path={levelPath}
        component={LabelledSelect}
        label={t('inspector.sceneForm.field.level.label')}
        options={levelOptions}
        allowEmpty
      />

      <SystemList />
    </Form>
  )
}
