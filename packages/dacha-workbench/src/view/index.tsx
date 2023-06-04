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
  SettingsModal,
} from './modules'
import { EngineContext } from './providers'
import {
  EditorStyled,
  ExplorerStyled,
  CanvasStyled,
  ToolbarStyled,
  InspectorStyled,
  CanvasRootStyled,
  HelperCanvasRootStyled,
} from './app.style'

export const App = (): JSX.Element => {
  const context = useContext(EngineContext)

  return (
    <EditorStyled>
      <ExplorerStyled>
        {context && <Explorer />}
      </ExplorerStyled>
      <CanvasStyled>
        <ToolbarStyled>
          {context && <Toolbar />}
        </ToolbarStyled>
        <CanvasRootStyled id={CANVAS_ROOT} />
        <HelperCanvasRootStyled id={GRID_ROOT} />
        <HelperCanvasRootStyled as="canvas" id={SHAPE_CANVAS_ROOT} />
      </CanvasStyled>
      <InspectorStyled>
        {context && <Inspector />}
      </InspectorStyled>

      {context && <SettingsModal />}
    </EditorStyled>
  )
}
