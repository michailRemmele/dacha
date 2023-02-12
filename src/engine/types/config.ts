export interface ComponentConfig {
  name: string
  config: Record<string, unknown>
}

export interface TemplateConfig {
  id: string
  name: string
  type: string
  components?: Array<ComponentConfig>
  children?: Array<TemplateConfig>
}

export interface GameObjectConfig {
  id: string
  name: string
  type?: string
  children?: Array<GameObjectConfig>
  components?: Array<ComponentConfig>
  fromTemplate?: boolean
  templateId?: string
}

export interface LevelConfig {
  id: string
  name: string
  gameObjects: Array<GameObjectConfig>
}

export interface SystemConfig {
  name: string
  options: Record<string, unknown>
}

export interface SceneConfig {
  id: string
  name: string
  levelId?: string
  systems: Array<SystemConfig>
}

export interface Config {
  scenes: Array<SceneConfig>
  levels: Array<LevelConfig>
  templates: Array<TemplateConfig>
  loaders: Array<SceneConfig>
  startSceneId: string
  startLoaderId?: string
}
