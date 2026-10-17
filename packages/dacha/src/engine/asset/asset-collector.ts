import { getSchema } from '../decorators';
import type { Schema } from '../decorators';
import type { ComponentConstructor } from '../component';
import type { SystemConstructor } from '../system';
import type {
  ActorConfig,
  AssetConfig,
  SystemConfig,
  TemplateConfig,
} from '../types';

import type { AssetConstructor } from './asset';

const SCRIPT_KINDS = new Set(['behavior', 'shader', 'filterEffect']);
const MAX_RESOURCE_DEPTH = 2;

interface AssetCollectorOptions {
  components: ComponentConstructor[];
  systems: SystemConstructor[];
  assets: AssetConstructor[];
  resources: Record<string, unknown>;
}

type ConfigData = Record<string, unknown> | undefined;

/**
 * Configuration that refers to assets: the asset ids found in it are retained
 * together.
 *
 * @internal
 */
export interface AssetSources {
  /** Asset ids to retain as they are. */
  ids?: Iterable<string>;
  /** System configurations; their options are read. */
  systems?: SystemConfig[];
  /** Actor configurations, with their children. */
  actors?: ActorConfig[];
  /** Template configurations, with their children. */
  templates?: TemplateConfig[];
}

const toSchemaMap = (
  classes: unknown[],
  getName: (value: never) => string,
): Map<string, Schema> => {
  const map = new Map<string, Schema>();
  classes.forEach((value) => {
    const schema = getSchema(value);
    if (schema) {
      map.set(getName(value as never), schema);
    }
  });
  return map;
};

/**
 * Finds the asset ids that raw configuration data references through `asset`
 * fields.
 */
export class AssetCollector {
  private componentSchemas: Map<string, Schema>;
  private systemSchemas: Map<string, Schema>;
  private assetSchemas: Map<string, Schema>;
  private scriptSchemas: Map<string, Schema>;

  constructor({
    components,
    systems,
    assets,
    resources,
  }: AssetCollectorOptions) {
    this.componentSchemas = toSchemaMap(
      components,
      (value: ComponentConstructor) => value.componentName,
    );
    this.systemSchemas = toSchemaMap(
      systems,
      (value: SystemConstructor) => value.systemName,
    );
    this.assetSchemas = toSchemaMap(
      assets,
      (value: AssetConstructor) => value.assetName,
    );

    this.scriptSchemas = new Map();
    Object.values(resources).forEach((value) => this.findScripts(value, 0));
  }

  /**
   * Returns the ids of other assets that the data of an asset refers to.
   */
  collectAssetRefs(config: AssetConfig): Set<string> {
    const ids = new Set<string>();
    this.collectData(config.data, this.assetSchemas.get(config.kind), ids);
    ids.delete(config.id);
    return ids;
  }

  /**
   * Returns the ids of the assets that scene and system configuration refers to
   * directly.
   */
  collectSources(sources: AssetSources): Set<string> {
    const ids = new Set<string>(sources.ids);
    sources.systems?.forEach((config) =>
      this.collectData(
        config.options,
        this.systemSchemas.get(config.name),
        ids,
      ),
    );
    sources.actors?.forEach((actor) => this.collectEntity(actor, ids));
    sources.templates?.forEach((template) => this.collectEntity(template, ids));
    return ids;
  }

  private collectEntity(
    entity: ActorConfig | TemplateConfig,
    ids: Set<string>,
  ): void {
    entity.components.forEach((component) =>
      this.collectData(
        component.config,
        this.componentSchemas.get(component.name),
        ids,
      ),
    );
    (entity.children as (ActorConfig | TemplateConfig)[]).forEach((child) =>
      this.collectEntity(child, ids),
    );
  }

  private collectData(
    data: ConfigData,
    schema: Schema | undefined,
    ids: Set<string>,
  ): void {
    if (!data || !schema) {
      return;
    }

    schema.fields.forEach((field) => {
      const value = data[field.name];

      if (field.type === 'asset') {
        if (typeof value === 'string' && value) {
          ids.add(value);
        }
        return;
      }

      if (field.type === 'script') {
        const entries = Array.isArray(value) ? value : value ? [value] : [];
        entries.forEach((entry: unknown) => {
          if (typeof entry !== 'object' || entry === null) {
            return;
          }
          const { name, options } = entry as {
            name?: unknown;
            options?: unknown;
          };
          if (typeof name !== 'string') {
            return;
          }
          this.collectData(
            options as ConfigData,
            this.scriptSchemas.get(`${field.kind}:${name}`),
            ids,
          );
        });
      }
    });
  }

  private findScripts(value: unknown, depth: number): void {
    const schema = getSchema(value);
    if (schema && SCRIPT_KINDS.has(schema.kind)) {
      this.scriptSchemas.set(`${schema.kind}:${schema.name}`, schema);
      return;
    }

    if (
      depth >= MAX_RESOURCE_DEPTH ||
      typeof value !== 'object' ||
      value === null
    ) {
      return;
    }

    (Array.isArray(value) ? value : Object.values(value)).forEach((child) =>
      this.findScripts(child, depth + 1),
    );
  }
}
