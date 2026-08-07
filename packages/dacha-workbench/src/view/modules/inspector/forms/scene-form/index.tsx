import { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  InputField,
  LabelledTextInput,
  Form,
} from '../../components'
import type { FormComponentProps } from '../types'

export const SceneForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation()

  const namePath = useMemo(() => path.concat('name'), [path])

  return (
    <Form>
      <InputField
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.sceneForm.field.name.label')}
      />
    </Form>
  )
}
