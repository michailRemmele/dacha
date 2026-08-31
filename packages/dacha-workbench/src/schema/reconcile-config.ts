import type {
  Config,
  ComponentConfig,
  GlobalOption,
  BehaviorsConfig,
  TemplateConfig,
  ActorConfig,
  SystemConfig,
  AssetConfig,
} from 'dacha';

import type { WidgetSchema } from '../types/widget-schema';

import { fillMissingFields, buildInitialState } from './initial-state';

export const BEHAVIORS_COMPONENT_NAME = 'Behaviors';

export interface ReconcileFix {
  path: string[];
  value: unknown;
}

export interface ReconcileSchemas {
  components: Record<string, WidgetSchema>;
  systems: Record<string, WidgetSchema>;
  globalOptions: Record<string, WidgetSchema>;
  behaviors: Record<string, WidgetSchema>;
  assets: Record<string, WidgetSchema>;
}

type BehaviorEntry = BehaviorsConfig['list'][number] & { id: string };

const reconcileGlobalOptions = (
  globalOptions: GlobalOption[],
  schemas: ReconcileSchemas,
  fixes: ReconcileFix[],
): void => {
  const schemaNames = Object.keys(schemas.globalOptions);

  const missingGroups: GlobalOption[] = [];
  schemaNames.forEach((name) => {
    const schema = schemas.globalOptions[name];
    if (!schema.fields) {
      return;
    }
    if (globalOptions.some((entry) => entry.name === name)) {
      return;
    }
    missingGroups.push({ name, options: buildInitialState(schema.fields) });
  });

  if (missingGroups.length > 0) {
    fixes.push({
      path: ['globalOptions'],
      value: [...globalOptions, ...missingGroups],
    });
  }

  schemaNames.forEach((name) => {
    const schema = schemas.globalOptions[name];
    if (!schema.fields) {
      return;
    }
    const group = globalOptions.find((entry) => entry.name === name);
    if (group === undefined) {
      return;
    }
    const options = group.options ?? {};
    const filledOptions = fillMissingFields(options, schema.fields);
    if (filledOptions !== options) {
      fixes.push({
        path: ['globalOptions', `name:${name}`, 'options'],
        value: filledOptions,
      });
    }
  });
};

const reconcileSystems = (
  systems: SystemConfig[],
  schemas: ReconcileSchemas,
  fixes: ReconcileFix[],
): void => {
  systems.forEach((system) => {
    const schema = schemas.systems[system.name];
    if (!schema?.fields) {
      return;
    }
    const options = system.options ?? {};
    const filledOptions = fillMissingFields(options, schema.fields);
    if (filledOptions !== options) {
      fixes.push({
        path: ['systems', `name:${system.name}`, 'options'],
        value: filledOptions,
      });
    }
  });
};

const reconcileComponents = (
  basePath: string[],
  components: ComponentConfig[],
  schemas: ReconcileSchemas,
  fixes: ReconcileFix[],
): void => {
  components.forEach((component) => {
    const schema = schemas.components[component.name];
    const configPath = [...basePath, `name:${component.name}`, 'config'];
    const config = component.config ?? {};

    let filledConfig = config;
    if (schema?.fields) {
      filledConfig = fillMissingFields(config, schema.fields);
      if (filledConfig !== config) {
        fixes.push({ path: configPath, value: filledConfig });
      }
    }

    if (component.name === BEHAVIORS_COMPONENT_NAME) {
      const list = (filledConfig.list ?? []) as BehaviorEntry[];
      list.forEach((entry) => {
        const behaviorSchema = schemas.behaviors[entry.name];
        if (!behaviorSchema?.fields) {
          return;
        }
        const options = entry.options ?? {};
        const filledOptions = fillMissingFields(options, behaviorSchema.fields);
        if (filledOptions !== options) {
          fixes.push({
            path: [...configPath, 'list', `id:${entry.id}`, 'options'],
            value: filledOptions,
          });
        }
      });
    }
  });
};

const reconcileActors = (
  basePath: string[],
  actors: ActorConfig[] | TemplateConfig[],
  schemas: ReconcileSchemas,
  fixes: ReconcileFix[],
): void => {
  actors.forEach((actor) => {
    const actorPath = [...basePath, `id:${actor.id}`];
    reconcileComponents(
      [...actorPath, 'components'],
      actor.components ?? [],
      schemas,
      fixes,
    );
    reconcileActors(
      [...actorPath, 'children'],
      actor.children ?? [],
      schemas,
      fixes,
    );
  });
};

const reconcileAssets = (
  assets: AssetConfig[] | undefined,
  schemas: ReconcileSchemas,
  fixes: ReconcileFix[],
): void => {
  if (assets === undefined) {
    fixes.push({ path: ['assets'], value: [] });
    return;
  }

  assets.forEach((asset) => {
    const schema = schemas.assets[asset.kind];
    if (!schema) {
      return;
    }

    if (schema.fields) {
      const data = asset.data ?? {};
      const filledData = fillMissingFields(data, schema.fields);
      if (filledData !== data) {
        fixes.push({
          path: ['assets', `id:${asset.id}`, 'data'],
          value: filledData,
        });
      }
    }
  });
};

export const reconcileConfig = (
  config: unknown,
  schemas: ReconcileSchemas,
): ReconcileFix[] => {
  const projectConfig = (config ?? {}) as Config;
  const fixes: ReconcileFix[] = [];

  projectConfig.scenes?.forEach((scene) => {
    reconcileActors(
      ['scenes', `id:${scene.id}`, 'actors'],
      scene.actors ?? [],
      schemas,
      fixes,
    );
  });

  reconcileActors(['templates'], projectConfig.templates, schemas, fixes);

  reconcileSystems(projectConfig.systems, schemas, fixes);

  reconcileGlobalOptions(projectConfig.globalOptions, schemas, fixes);

  reconcileAssets(projectConfig.assets, schemas, fixes);

  return fixes;
};
