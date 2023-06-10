import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const TimelineWrapperStyled = styled.div`
  // timeline padding + frame padding + frame border + line height
  height: calc(15px * 2 + 31px * 2 + 20px);
`

export const ListStyled = styled.ul`
  display: flex;

  list-style: none;

  padding: 15px;
  margin: 0px;
`

export const ListItemStyled = styled.li`
  flex-shrink: 0;

  & + & {
    margin-left: 15px;
  }
`

interface FrameButtonStyledProps {
  isSelected?: boolean
}

export const FrameButtonStyled = styled.button<FrameButtonStyledProps>(({ theme, isSelected }) => css`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  border: none;

  padding: 30px;

  border: 1px solid ${theme.colorBorder};
  background: transparent;

  cursor: pointer;

  ${isSelected && css`
    border: 1px solid ${theme.colorPrimary};
    background-color: ${theme.colorPrimary};

    color: ${theme.colorWhite};
  `}
`)
