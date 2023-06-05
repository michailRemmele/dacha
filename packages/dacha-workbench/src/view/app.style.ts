import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const EditorStyled = styled.div(({ theme }) => css`
  display: flex;

  width: 100%;
  height: 100%;

  background-color: ${theme.colorBgContainer};
`)

export const ExplorerStyled = styled.div`
  width: 25%;
`

export const CanvasStyled = styled.div`
  width: 50%;

  display: flex;
  flex-direction: column;

  user-select: none;

  position: relative;
`

export const ToolbarStyled = styled.div`
  height: 35px;
`

export const InspectorStyled = styled.div`
  width: 25%;
`

export const HelperCanvasRootStyled = styled.div`
  width: 100%;
  height: calc(100% - 35px);

  position: absolute;
  top: 35px;

  pointer-events: none;
`

export const CanvasRootStyled = styled.div`
  flex: 1;

  &.canvas-root_tool_hand {
    cursor: grab;
  }

  &.canvas-root_tool_pointer {
    cursor: pointer;
  }

  &.canvas-root_tool_zoom.canvas-root_feature-direction_in {
    cursor: zoom-in;
  }

  &.canvas-root_tool_zoom.canvas-root_feature-direction_out {
    cursor: zoom-out;
  }
`
