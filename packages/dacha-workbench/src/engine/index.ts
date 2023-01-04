import {
  ProjectLoader,
  LevelViewer,
  ToolManager,
  ZoomToolSystem,
  HandToolSystem,
  Commander,
} from './systems'

import {
  Tool,
} from './components'

export const editorSystems = {
  commander: Commander,
  projectLoader: ProjectLoader,
  levelViewer: LevelViewer,
  toolManager: ToolManager,
  zoomToolSystem: ZoomToolSystem,
  handToolSystem: HandToolSystem,
}

export const editorComponents = {
  tool: Tool,
}
