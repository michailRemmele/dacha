import React, { useContext, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { SelectedEntityContext } from '../../../../providers'
import { Widget } from '../widget'
import type { Entity } from '../entity-list/types'

import './style.less'

const COMPONENTS_KEY = 'components'
const CONFIG_KEY = 'config'

type ComponentFormProps = Entity

export const ComponentForm: FC<ComponentFormProps> = ({ data }) => {
  const { t } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)

  const { schema, name } = data

  if (!schema.fields || schema.fields.length === 0) {
    return (
      <div className="component-form">
        {t('inspector.entityList.content.empty.title')}
      </div>
    )
  }

  return (
    <Widget
      fields={schema.fields}
      references={schema.references}
      path={path.concat(COMPONENTS_KEY, name, CONFIG_KEY)}
    />
  )
}
