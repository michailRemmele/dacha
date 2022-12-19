import React, { useContext, FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import { SelectedEntityContext } from '../../../../providers'
import { Widget } from '../widget'
import { CustomWidget } from '../custom-widget'
import type { Entity } from '../entity-list/types'

import './style.less'

const COMPONENTS_KEY = 'components'
const CONFIG_KEY = 'config'

type ComponentFormProps = Entity

export const ComponentForm: FC<ComponentFormProps> = ({ data }) => {
  const { t, i18n } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)

  const { schema, name } = data

  if (schema.view) {
    return (
      <CustomWidget
        fields={schema.fields || []}
        references={schema.references}
        path={path.concat(COMPONENTS_KEY, name, CONFIG_KEY)}
        component={schema.view}
        namespace={data.namespace}
      />
    )
  }

  if (!schema.fields || schema.fields.length === 0) {
    return (
      <div className="component-form">
        {t('inspector.entityList.content.empty.title')}
      </div>
    )
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS={data.namespace}>
      <Widget
        fields={schema.fields}
        references={schema.references}
        path={path.concat(COMPONENTS_KEY, name, CONFIG_KEY)}
      />
    </I18nextProvider>
  )
}
