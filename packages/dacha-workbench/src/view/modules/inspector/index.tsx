import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { SelectedEntityContext } from '../../providers'

import { forms } from './forms'

import './style.less'

export const Inspector = (): JSX.Element => {
  const { t } = useTranslation()
  const { type } = useContext(SelectedEntityContext)

  const FormComponent = type ? forms[type] : null

  return (
    <div className="inspector">
      <header className="inspector__header">
        <h2 className="inspector__title">{t('inspector.header.title')}</h2>
      </header>
      <div className="inspector__content">
        {FormComponent && <FormComponent />}
      </div>
    </div>
  )
}
