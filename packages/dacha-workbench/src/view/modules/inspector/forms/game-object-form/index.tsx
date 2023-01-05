import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameObjectConfig } from 'remiz'

import {
  Field,
  LabelledTextInput,
  Form,
  ComponentList,
} from '../../components'
import { useConfig } from '../../../../hooks'
import type { FormComponentProps } from '../types'

export const GameObjectForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  const namePath = useMemo(() => path.concat('name'), [path])
  const templateNamePath = useMemo(() => path.concat('templateName'), [path])
  const typePath = useMemo(() => path.concat('type'), [path])

  const { templateName } = useConfig(path) as GameObjectConfig

  return (
    <Form>
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.gameObjectForm.field.name.label')}
      />
      {templateName ? (
        <Field
          path={templateNamePath}
          component={LabelledTextInput}
          label={t('inspector.gameObjectForm.field.templateName.label')}
          disabled
        />
      ) : null}
      <Field
        path={typePath}
        component={LabelledTextInput}
        label={t('inspector.gameObjectForm.field.type.label')}
      />

      <ComponentList />
    </Form>
  )
}
