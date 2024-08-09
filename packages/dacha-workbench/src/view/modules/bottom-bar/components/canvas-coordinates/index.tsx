import {
  useState,
  useEffect,
  useContext,
  FC,
} from 'react'
import type { MouseControlEvent } from 'remiz/events'
import { PlusOutlined, BorderInnerOutlined } from '@ant-design/icons'

import { persistentStorage } from '../../../../../persistent-storage'
import { throttle } from '../../../../../utils/throttle'
import { getGridStep } from '../../../../../utils/grid'
import { EngineContext } from '../../../../providers'
import { EventType } from '../../../../../events'
import type { SelectLevelEvent } from '../../../../../events'

import { getGridSection } from './utils'
import { CanvasCoordinatesStyled, SectionStyled, IconsCSS } from './canvas-coordinates.style'

const DELAY = 50

export const CanvasCoordinates: FC = () => {
  const { scene } = useContext(EngineContext)

  const [isCursor, setIsCursor] = useState(false)
  const [isLevel, setIsLevel] = useState(Boolean(persistentStorage.get('selectedLevel')))

  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)

  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)

  useEffect(() => {
    const updateCoordinates = throttle((x: number, y: number): void => {
      const step = getGridStep(scene)

      setCursorX(Math.round(x))
      setCursorY(Math.round(y))

      setGridX(getGridSection(x, step))
      setGridY(getGridSection(y, step))
    }, DELAY)

    const handleCursorMove = (event: MouseControlEvent): void => {
      updateCoordinates(event.x, event.y)
      setIsCursor(true)
    }

    const handleCursorLeave = (): void => {
      setIsCursor(false)
    }

    const handleSelectLevel = (event: SelectLevelEvent): void => {
      setIsLevel(Boolean(event.levelId))
    }

    scene.addEventListener(EventType.SelectLevel, handleSelectLevel)
    scene.addEventListener(EventType.ToolCursorMove, handleCursorMove)
    scene.addEventListener(EventType.ToolCursorLeave, handleCursorLeave)

    return () => {
      scene.removeEventListener(EventType.SelectLevel, handleSelectLevel)
      scene.removeEventListener(EventType.ToolCursorMove, handleCursorMove)
      scene.removeEventListener(EventType.ToolCursorLeave, handleCursorLeave)
    }
  }, [])

  if (!isCursor || !isLevel) {
    return null
  }

  return (
    <CanvasCoordinatesStyled>
      <SectionStyled>
        <PlusOutlined css={IconsCSS} />
        {`${cursorX} ${cursorY}`}
      </SectionStyled>
      <SectionStyled>
        <BorderInnerOutlined css={IconsCSS} />
        {`${gridX} ${gridY}`}
      </SectionStyled>
    </CanvasCoordinatesStyled>
  )
}
