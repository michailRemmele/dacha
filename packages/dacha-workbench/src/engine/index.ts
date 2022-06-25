import {
  ProjectLoader,
  LevelViewer,
  ToolManager,
  ZoomToolSystem,
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
}

export const editorComponents = {
  tool: Tool,
}

export const helpers = {
  loadUiApp,
}
