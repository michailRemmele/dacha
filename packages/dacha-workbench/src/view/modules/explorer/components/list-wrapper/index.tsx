import {
  useCallback,
  useContext,
  FC,
} from 'react'

import { EngineContext } from '../../../../providers'
import { EventType } from '../../../../../events'

import { ListWrapperStyled } from './list-wrapper.style'

interface ListWrapperProps {
  children: JSX.Element | Array<JSX.Element>
}

export const ListWrapper: FC<ListWrapperProps> = ({ children }) => {
  const { scene } = useContext(EngineContext)

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      scene.dispatchEvent(EventType.InspectEntity, {
        path: undefined,
      })
    }
  }, [])

  return (
    <ListWrapperStyled
      role="presentation"
      onClick={handleClick}
    >
      {children}
    </ListWrapperStyled>
  )
}
