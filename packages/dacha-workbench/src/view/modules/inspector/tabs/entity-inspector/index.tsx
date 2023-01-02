import React, { useContext } from 'react'

import { SelectedEntityContext } from '../../../../providers'

import { forms } from '../../forms'

export const EntityInspector = (): JSX.Element | null => {
  const { type, path = [] } = useContext(SelectedEntityContext)

  const FormComponent = type ? forms[type] : null

  if (!FormComponent) {
    return null
  }

  return <FormComponent path={path} />
}
