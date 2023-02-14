import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Field,
  LabelledTextInput,
  Form,
} from '../../components'
import type { FormComponentProps } from '../types'

export const LevelForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  const namePath = useMemo(() => path.concat('name'), [path])

  return (
    <Form>
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.levelForm.field.name.label')}
      />
    </Form>
  )
}
