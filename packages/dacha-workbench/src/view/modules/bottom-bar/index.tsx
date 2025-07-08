import type { FC } from 'react'

import { ReloadButton, CanvasCoordinates, UpdateIndicator } from './components'
import {
  BottomBarStyled,
  LeftSectionStyled,
  RightSectionStyled,
} from './bottom-bar.style'

export const BottomBar: FC = () => (
  <BottomBarStyled>
    <LeftSectionStyled>
      <CanvasCoordinates />
    </LeftSectionStyled>
    <RightSectionStyled>
      <ReloadButton />
      <UpdateIndicator />
    </RightSectionStyled>
  </BottomBarStyled>
)
