export interface ComponentConfig {
  name: string
  config: Record<string, unknown>
}

export interface PrefabConfig {
  name: string
  type: string
  components?: Array<ComponentConfig>
  children?: Array<PrefabConfig>
}

export interface EntityConfig {
  id: string
  name: string
  type?: string
  children?: Array<EntityConfig>
  components?: Array<ComponentConfig>
  fromPrefab?: boolean
  prefabName?: string
}

export interface LevelConfig {
  name: string
  entities: Array<EntityConfig>
}

export interface SystemConfig {
  name: string
  options: Record<string, unknown>
}

export interface SceneConfig {
  name: string
  level?: string
  systems: Array<SystemConfig>
}

export interface Config {
  scenes: Array<SceneConfig>
  levels: Array<LevelConfig>
  prefabs: Array<PrefabConfig>
  loaders: Array<SceneConfig>
  startScene: string
  startLoader?: string
}
