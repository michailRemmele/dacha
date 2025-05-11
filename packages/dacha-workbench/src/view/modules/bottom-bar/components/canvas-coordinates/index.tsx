import {
  useState,
  useEffect,
  useContext,
  FC,
} from 'react'
import type { MouseControlEvent } from 'dacha/events'
import { PlusOutlined, BorderInnerOutlined } from '@ant-design/icons'

import { throttle } from '../../../../../utils/throttle'
import { getSavedSelectedSceneId } from '../../../../../utils/get-saved-selected-scene-id'
import { getGridStep } from '../../../../../utils/grid'
import { EngineContext } from '../../../../providers'
import { EventType } from '../../../../../events'
import { useStore } from '../../../../hooks/use-store'
import type { SelectSceneEvent } from '../../../../../events'

import { getGridSection } from './utils'
import { CanvasCoordinatesStyled, SectionStyled, IconsCSS } from './canvas-coordinates.style'

const DELAY = 50

export const CanvasCoordinates: FC = () => {
  const { world } = useContext(EngineContext)
  const store = useStore()

  const [isCursor, setIsCursor] = useState(false)
  const [isScene, setIsScene] = useState(Boolean(getSavedSelectedSceneId(store)))

  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)

  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)

  useEffect(() => {
    const updateCoordinates = throttle((x: number, y: number): void => {
      const step = getGridStep(world)

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

    const handleSelectScene = (event: SelectSceneEvent): void => {
      setIsScene(Boolean(event.sceneId))
    }

    world.addEventListener(EventType.SelectScene, handleSelectScene)
    world.addEventListener(EventType.ToolCursorMove, handleCursorMove)
    world.addEventListener(EventType.ToolCursorLeave, handleCursorLeave)

    return () => {
      world.removeEventListener(EventType.SelectScene, handleSelectScene)
      world.removeEventListener(EventType.ToolCursorMove, handleCursorMove)
      world.removeEventListener(EventType.ToolCursorLeave, handleCursorLeave)
    }
  }, [])

  if (!isCursor || !isScene) {
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
