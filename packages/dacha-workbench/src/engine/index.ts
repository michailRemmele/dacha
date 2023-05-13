import {
  ProjectLoader,
  LevelViewer,
  ToolManager,
  ZoomToolSystem,
  HandToolSystem,
  PointerToolSystem,
  TemplateToolSystem,
  Commander,
  ShapesRenderer,
} from './systems'

import {
  Tool,
  Shape,
} from './components'

export const editorSystems = {
  commander: Commander,
  projectLoader: ProjectLoader,
  levelViewer: LevelViewer,
  toolManager: ToolManager,
  zoomToolSystem: ZoomToolSystem,
  handToolSystem: HandToolSystem,
  pointerToolSystem: PointerToolSystem,
  templateToolSystem: TemplateToolSystem,
  shapesRenderer: ShapesRenderer,
}

export const editorComponents = {
  tool: Tool,
  shape: Shape,
}
