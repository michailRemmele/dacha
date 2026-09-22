/**
 * A game-wide setting in {@link Config}, such as `sorting` or `physics`.
 * Systems read it from `options.globalOptions[name]`.
 *
 * @category Engine
 */
export interface GlobalOption {
  /** The name systems use to read the setting. */
  name: string;
  /** The value of the setting. */
  options: Record<string, unknown>;
}

/**
 * A component in the configuration of an actor or a template.
 *
 * @category Engine
 */
export interface ComponentConfig {
  /** The `componentName` of the component class. */
  name: string;
  /** The values the engine passes to the component constructor. */
  config: Record<string, unknown>;
}

/**
 * An actor template: a reusable actor configuration.
 *
 * @see [Templates](https://dachajs.org/editor/templates/)
 *
 * @category Engine
 */
export interface TemplateConfig {
  /** A unique id. Actors and {@link ActorSpawner.spawn} refer to the template by it. */
  id: string;
  /** The name of the template. */
  name: string;
  /** The components of the template. */
  components: ComponentConfig[];
  /** Child templates. An actor created from the template gets a child actor for each. */
  children: TemplateConfig[];
}

/**
 * An actor placed in a scene.
 *
 * @category Engine
 */
export interface ActorConfig {
  /** A unique id. */
  id: string;
  /** The name of the actor. */
  name: string;
  /** Child actors. */
  children: ActorConfig[];
  /**
   * The components of the actor. For an actor created from a template, these
   * override the components of the template.
   */
  components: ComponentConfig[];
  /** The id of the template the actor is created from. */
  templateId?: string;
}

/**
 * A system that runs in the game, with its options.
 *
 * The order of `systems` in {@link Config} is the order in which the systems
 * run every frame.
 *
 * @category Engine
 */
export interface SystemConfig {
  /** The `systemName` of the system class. */
  name: string;
  /** The options the engine passes to the system constructor. */
  options: Record<string, unknown>;
}

/**
 * A scene and the actors in it.
 *
 * @category Engine
 */
export interface SceneConfig {
  /** A unique id. Use it to load the scene. */
  id: string;
  /** The name of the scene. */
  name: string;
  /** The top-level actors of the scene. */
  actors: ActorConfig[];
}

/**
 * A project asset, such as a texture or a sound.
 *
 * @category Engine
 */
export interface AssetConfig {
  /** A unique id. Use it with {@link Assets.get}. */
  id: string;
  /** The name of the asset. */
  name: string;
  /** The `assetName` of the asset class, such as `texture`. */
  kind: string;
  /** The data the engine passes to the asset class. */
  data: Record<string, unknown>;
}

/**
 * The whole game configuration. The editor writes it, and {@link Engine} runs it.
 *
 * @see [Configuration](https://dachajs.org/concepts/configuration/)
 *
 * @category Engine
 */
export interface Config {
  /** The scenes of the game. */
  scenes: SceneConfig[];
  /** The actor templates. */
  templates: TemplateConfig[];
  /** The systems that run, in the order they run. */
  systems: SystemConfig[];
  /** The project assets. */
  assets: AssetConfig[];
  /** The id of the scene the engine loads first. {@link Engine.play} throws without it. */
  startSceneId: string | null;
  /** Game-wide settings. */
  globalOptions: GlobalOption[];
}
