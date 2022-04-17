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

export interface SystemConfig {
  name: string
  options: Record<string, unknown>
}

export interface SceneConfig {
  name: string
  entities: Array<EntityConfig>
  systems: Array<SystemConfig>
}

export interface Config {
  scenes: Array<SceneConfig>
  prefabs: Array<PrefabConfig>
  startScene: string
}
