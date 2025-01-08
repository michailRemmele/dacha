import {
  useCallback,
  useContext,
  forwardRef,
} from 'react'

import { EngineContext } from '../../../../providers'
import { EventType } from '../../../../../events'

import { ListWrapperStyled } from './list-wrapper.style'

interface ListWrapperProps {
  children: JSX.Element | Array<JSX.Element>
}

export const ListWrapper = forwardRef<HTMLDivElement, ListWrapperProps>(({ children }, ref) => {
  const { scene } = useContext(EngineContext)

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      scene.dispatchEvent(EventType.SelectEntities, {
        paths: [],
      })
      scene.dispatchEvent(EventType.InspectEntity, {
        path: undefined,
      })
    }
  }, [scene])

  return (
    <ListWrapperStyled
      ref={ref}
      role="presentation"
      onClick={handleClick}
    >
      {children}
    </ListWrapperStyled>
  )
})
