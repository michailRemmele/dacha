import { FC } from 'react'

import {
  StateList,
  TransitionList,
  Timeline,
  Inspector,
} from './components'

import {
  EditorStyled,
  EditorSectionStyled,
  StateTreeStyled,
  StateListCSS,
  TransitionListCSS,
  FooterStyled,
  AsideStyled,
} from './editor.style'

export const Editor: FC = () => (
  <EditorStyled>
    <EditorSectionStyled>
      <StateTreeStyled>
        <StateList css={StateListCSS} />
        <TransitionList css={TransitionListCSS} />
      </StateTreeStyled>
      <FooterStyled>
        <Timeline />
      </FooterStyled>
    </EditorSectionStyled>
    <AsideStyled>
      <Inspector />
    </AsideStyled>
  </EditorStyled>
)
