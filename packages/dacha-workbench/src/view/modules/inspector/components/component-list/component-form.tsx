import React, { useContext, FC } from 'react'

import { SelectedEntityContext } from '../../../../providers'
import { componentsSchema } from '../../../../engine-widgets-schema'
import { Widget } from '../widget'

const COMPONENTS_KEY = 'components'
const CONFIG_KEY = 'config'

interface ComponentPanelProps {
  entity: {
    id: string
    name: string
  }
}

export const ComponentForm: FC<ComponentPanelProps> = ({ entity }) => {
  const { path = [] } = useContext(SelectedEntityContext)

  const schema = componentsSchema[entity.name]

  if (!schema) {
    return null
  }

  return (
    <Widget schema={schema} path={path.concat(COMPONENTS_KEY, entity.name, CONFIG_KEY)} />
  )
}
