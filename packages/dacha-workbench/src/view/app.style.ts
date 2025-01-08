import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

import { CANVAS_ROOT } from '../consts/root-nodes'

export const EditorCSS = (): SerializedStyles => {
  const theme = useTheme()
  return css`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    background-color: ${theme.colorBgContainer};
    border-top: 1px solid ${theme.colorBorder};
  `
}

export const EditorMainStyled = styled.div`
  display: flex;

  width: 100%;
  height: calc(100% - 25px);
`

export const ExplorerStyled = styled.div`
  width: 25%;
`

export const CanvasRootCSS = (): SerializedStyles => {
  const theme = useTheme()
  return css`
    overflow: hidden;

    flex: 1;

    background-color: ${theme.colorBgLayout};

    &.canvas-root_tool_hand {
      cursor: grab;
    }

    &.canvas-root_tool_pointer {
      cursor: default;
    }

    &.canvas-root_tool_zoom.canvas-root_feature-direction_in {
      cursor: zoom-in;
    }

    &.canvas-root_tool_zoom.canvas-root_feature-direction_out {
      cursor: zoom-out;
    }
  `
}

export const CanvasStyled = styled.div`
  width: 50%;

  display: flex;
  flex-direction: column;

  user-select: none;

  position: relative;

  #${CANVAS_ROOT} {
    ${CanvasRootCSS}
  }
`

export const ToolbarStyled = styled.div`
  height: 35px;
`

export const InspectorStyled = styled.div`
  width: 25%;
`

export const HelperCanvasRootCSS = css`
  width: 100%;
  height: calc(100% - 35px);

  position: absolute;
  top: 35px;

  pointer-events: none;

  image-rendering: pixelated;
`
