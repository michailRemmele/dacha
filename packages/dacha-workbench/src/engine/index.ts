import {
  ProjectLoader,
  LevelViewer,
  ToolManager,
  ZoomToolSystem,
  HandToolSystem,
} from './systems'

import {
  Tool,
} from './components'

import { loadUiApp } from './helpers'

export const editorSystems = {
  projectLoader: ProjectLoader,
  levelViewer: LevelViewer,
  toolManager: ToolManager,
  zoomToolSystem: ZoomToolSystem,
  handToolSystem: HandToolSystem,
}

export const editorComponents = {
  tool: Tool,
}

export const helpers = {
  loadUiApp,
}
