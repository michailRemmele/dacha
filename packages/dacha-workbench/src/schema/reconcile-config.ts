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
}

interface ComponentEntry {
  name: string;
  config?: Record<string, unknown>;
}
interface SystemEntry {
  name: string;
  options?: Record<string, unknown>;
}
interface GlobalOptionEntry {
  name: string;
  options?: Record<string, unknown>;
}
interface BehaviorEntry {
  id: string;
  name: string;
  options?: Record<string, unknown>;
}
interface ActorLikeEntry {
  id: string;
  components?: ComponentEntry[];
  children?: ActorLikeEntry[];
}
interface ProjectConfig {
  scenes?: { id: string; actors?: ActorLikeEntry[] }[];
  templates?: ActorLikeEntry[];
  systems?: SystemEntry[];
  globalOptions?: GlobalOptionEntry[];
}

const reconcileComponents = (
  basePath: string[],
  components: ComponentEntry[],
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
  actors: ActorLikeEntry[],
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

export const reconcileConfig = (
  config: unknown,
  schemas: ReconcileSchemas,
): ReconcileFix[] => {
  const fixes: ReconcileFix[] = [];
  const projectConfig = (config ?? {}) as ProjectConfig;

  projectConfig.scenes?.forEach((scene) => {
    reconcileActors(
      ['scenes', `id:${scene.id}`, 'actors'],
      scene.actors ?? [],
      schemas,
      fixes,
    );
  });

  reconcileActors(['templates'], projectConfig.templates ?? [], schemas, fixes);

  projectConfig.systems?.forEach((system) => {
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

  const globalOptions = projectConfig.globalOptions ?? [];
  const schemaNames = Object.keys(schemas.globalOptions);

  /* comment: Coarser parent-path fixes must be pushed BEFORE narrower nested-path ones,
   * so applying the fixes in order stays consistent. The whole-array `['globalOptions']`
   * write below is built from the pre-fix array, so emitting it after a nested
   * `['globalOptions', 'name:x', 'options']` fill would clobber that fill. */
  const missingGroups: GlobalOptionEntry[] = [];
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
      /* comment: Appended above via buildInitialState, so it is already complete */
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

  return fixes;
};
