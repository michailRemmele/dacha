import {
  useCallback,
  useContext,
  FC,
} from 'react'

import { EngineContext } from '../../../../providers'
import { INSPECT_ENTITY_MSG } from '../../../../../consts/message-types'

import { ListWrapperStyled } from './list-wrapper.style'

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
    <ListWrapperStyled
      role="presentation"
      onClick={handleClick}
    >
      {children}
    </ListWrapperStyled>
  )
}
