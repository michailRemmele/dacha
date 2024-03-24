import { useContext } from 'react'

import {
  CANVAS_ROOT,
  SHAPE_CANVAS_ROOT,
  GRID_ROOT,
} from '../consts/root-nodes'

import {
  Explorer,
  Inspector,
  Toolbar,
  BottomBar,
  SettingsModal,
} from './modules'
import { useUnsavedChanges } from './hooks'
import { EngineContext } from './providers'
import {
  EditorStyled,
  EditorMainStyled,
  ExplorerStyled,
  CanvasStyled,
  ToolbarStyled,
  InspectorStyled,
  HelperCanvasRootCSS,
} from './app.style'

export const App = (): JSX.Element => {
  const context = useContext(EngineContext)

  useUnsavedChanges()

  return (
    <EditorStyled>
      <EditorMainStyled>
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
      </EditorMainStyled>
      <BottomBar />

      {context && <SettingsModal />}
    </EditorStyled>
  )
}
