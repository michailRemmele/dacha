export interface GlobalOption {
  name: string
  options: Record<string, unknown>
}

export interface ComponentConfig {
  name: string
  config: Record<string, unknown>
}

export interface TemplateConfig {
  id: string
  name: string
  components?: ComponentConfig[]
  children?: TemplateConfig[]
}

export interface ActorConfig {
  id: string
  name: string
  children?: ActorConfig[]
  components?: ComponentConfig[]
  templateId?: string
}

export interface LevelConfig {
  id: string
  name: string
  actors: ActorConfig[]
}

export interface SystemConfig {
  name: string
  options: Record<string, unknown>
}

export interface SceneConfig {
  id: string
  name: string
  levelId: string | null
  systems: SystemConfig[]
}

export interface Config {
  scenes: SceneConfig[]
  levels: LevelConfig[]
  templates: TemplateConfig[]
  loaders: SceneConfig[]
  startSceneId: string | null
  startLoaderId: string | null
  globalOptions: GlobalOption[]
}
