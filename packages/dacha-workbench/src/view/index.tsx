import { useContext } from 'react'

import {
  CANVAS_ROOT,
  SHAPE_CANVAS_ROOT,
  GRID_ROOT,
  MODAL_ROOT,
} from '../consts/root-nodes'

import {
  Explorer,
  Inspector,
  Toolbar,
  SettingsModal,
} from './modules'
import { EngineContext, CommandScope } from './providers'
import {
  EditorCSS,
  ExplorerStyled,
  CanvasStyled,
  ToolbarStyled,
  InspectorStyled,
  HelperCanvasRootCSS,
} from './app.style'

export const App = (): JSX.Element => {
  const context = useContext(EngineContext)

  return (
    <CommandScope css={EditorCSS}>
      <ExplorerStyled>
        {context && <Explorer />}
      </ExplorerStyled>
      <CanvasStyled>
        <ToolbarStyled>
          {context && <Toolbar />}
        </ToolbarStyled>
        <div id={CANVAS_ROOT} />
        <div
          id={GRID_ROOT}
          css={HelperCanvasRootCSS}
        />
        <canvas
          id={SHAPE_CANVAS_ROOT}
          css={HelperCanvasRootCSS}
        />
      </CanvasStyled>
      <InspectorStyled>
        {context && <Inspector />}
      </InspectorStyled>

      {context && <SettingsModal />}

      <CommandScope name="modal">
        <div id={MODAL_ROOT} />
      </CommandScope>
    </CommandScope>
  )
}
