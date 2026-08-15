export interface GlobalOption {
  name: string;
  options: Record<string, unknown>;
}

export interface ComponentConfig {
  name: string;
  config: Record<string, unknown>;
}

export interface TemplateConfig {
  id: string;
  name: string;
  components: ComponentConfig[];
  children: TemplateConfig[];
}

export interface ActorConfig {
  id: string;
  name: string;
  children: ActorConfig[];
  components: ComponentConfig[];
  templateId?: string;
}

export interface SystemConfig {
  name: string;
  options: Record<string, unknown>;
}

export interface SceneConfig {
  id: string;
  name: string;
  actors: ActorConfig[];
}

export interface AssetConfig {
  id: string;
  name: string;
  kind: string;
  data: Record<string, unknown>;
}

export interface Config {
  scenes: SceneConfig[];
  templates: TemplateConfig[];
  systems: SystemConfig[];
  assets: AssetConfig[];
  startSceneId: string | null;
  globalOptions: GlobalOption[];
}
