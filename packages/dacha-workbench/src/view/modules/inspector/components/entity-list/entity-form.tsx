import React, { useContext, FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import { SelectedEntityContext } from '../../../../providers'
import { Widget } from '../widget'
import { CustomWidget } from '../custom-widget'

import type { Entity, EntityType } from './types'

import './style.less'

const CONFIG_KEY_MAP: Record<EntityType, string> = {
  components: 'config',
  systems: 'options',
}

interface EntityFormProps extends Entity {
  type: EntityType
}

export const EntityForm: FC<EntityFormProps> = ({ data, type }) => {
  const { t, i18n } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)

  const { schema, name } = data

  if (schema.view) {
    return (
      <CustomWidget
        fields={schema.fields || []}
        references={schema.references}
        path={path.concat(type, name, CONFIG_KEY_MAP[type])}
        component={schema.view}
        namespace={data.namespace}
      />
    )
  }

  if (!schema.fields || schema.fields.length === 0) {
    return (
      <div className="entity-form">
        {t('inspector.entityList.content.empty.title')}
      </div>
    )
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS={data.namespace}>
      <Widget
        fields={schema.fields}
        references={schema.references}
        path={path.concat(type, name, CONFIG_KEY_MAP[type])}
      />
    </I18nextProvider>
  )
}
