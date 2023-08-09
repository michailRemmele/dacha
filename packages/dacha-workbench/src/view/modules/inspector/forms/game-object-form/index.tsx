import { useMemo, FC } from 'react'
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

import { TemplateField } from './template-field'

export const GameObjectForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  const namePath = useMemo(() => path.concat('name'), [path])
  const typePath = useMemo(() => path.concat('type'), [path])

  const { templateId } = useConfig(path) as GameObjectConfig

  return (
    <Form>
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.gameObjectForm.field.name.label')}
      />
      {templateId ? (
        <TemplateField path={path} />
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
