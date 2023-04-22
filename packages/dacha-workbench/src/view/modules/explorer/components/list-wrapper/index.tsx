import React, {
  useCallback,
  useContext,
  FC,
} from 'react'

import { EngineContext } from '../../../../providers'
import { INSPECT_ENTITY_MSG } from '../../../../../consts/message-types'

import './style.less'

interface ListWrapperProps {
  children: JSX.Element | Array<JSX.Element>
}

export const ListWrapper: FC<ListWrapperProps> = ({ children }) => {
  const { pushMessage } = useContext(EngineContext)

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      pushMessage({
        type: INSPECT_ENTITY_MSG,
        path: undefined,
      })
    }
  }, [pushMessage])

  return (
    <div
      role="presentation"
      className="list-wrapper"
      onClick={handleClick}
    >
      {children}
    </div>
  )
}
