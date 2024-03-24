import type { FC } from 'react'

import { ReloadButton } from './components'
import {
  BottomBarStyled,
  LeftSectionStyled,
  RightSectionStyled,
} from './bottom-bar.style'

export const BottomBar: FC = () => (
  <BottomBarStyled>
    <LeftSectionStyled />
    <RightSectionStyled>
      <ReloadButton />
    </RightSectionStyled>
  </BottomBarStyled>
)
