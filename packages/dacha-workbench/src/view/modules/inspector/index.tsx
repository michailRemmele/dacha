import React from 'react'

import { useEntity } from '../../hooks'

import './style.less'

export const Inspector = (): JSX.Element => {
  const [entity] = useEntity()

  return (
    <div className="inspector">
      {typeof entity === 'object' ? JSON.stringify(entity) : String(entity || '')}
    </div>
  )
}
