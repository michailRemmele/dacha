import type {
  Config,
  ComponentConfig,
  GlobalOption,
  TemplateConfig,
  ActorConfig,
  SystemConfig,
  AssetConfig,
  Field,
  ScriptFieldKind,
} from 'dacha';

import type { WidgetSchema } from '../types/widget-schema';

import { fillMissingFields, buildInitialState } from './initial-state';

export interface ReconcileFix {
  path: string[];
  value: unknown;
}

export interface ReconcileSchemas {
  components: Record<string, WidgetSchema>;
  systems: Record<string, WidgetSchema>;
  globalOptions: Record<string, WidgetSchema>;
  scripts: Record<ScriptFieldKind, Record<string, WidgetSchema>>;
  assets: Record<string, WidgetSchema>;
}

interface ScriptEntry {
  id?: string;
  name: string;
  options?: Record<string, unknown>;
}

const reconcileFields = (
  value: Record<string, unknown>,
  fields: Field[],
  path: string[],
  schemas: ReconcileSchemas,
  fixes: ReconcileFix[],
): void => {
  const filled = fillMissingFields(value, fields);
  if (filled !== value) {
    fixes.push({ path, value: filled });
  }

  fields.forEach((field) => {
    if (field.type !== 'script') {
      return;
    }

    const reconcileEntry = (
      entry: ScriptEntry | undefined,
      entryPath: string[],
    ): void => {
      const entryFields = entry
        ? schemas.scripts[field.kind][entry.name]?.fields
        : undefined;
      if (!entry || !entryFields) {
        return;
      }
      reconcileFields(
        entry.options ?? {},
        entryFields,
        entryPath,
        schemas,
        fixes,
      );
    };

    if (field.multiple) {
      ((filled[field.name] ?? []) as ScriptEntry[]).forEach((entry) => {
        reconcileEntry(entry, [
          ...path,
          field.name,
          `id:${entry.id}`,
          'options',
        ]);
      });
    } else {
      reconcileEntry(filled[field.name] as ScriptEntry | undefined, [
        ...path,
        field.name,
        'options',
      ]);
    }
  });
};

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
    reconcileFields(
      group.options ?? {},
      schema.fields,
      ['globalOptions', `name:${name}`, 'options'],
      schemas,
      fixes,
    );
  });
};

const reconcileSystems = (
  systems: SystemConfig[],
  schemas: ReconcileSchemas,
  fixes: ReconcileFix[],
): void => {
  systems.forEach((system) => {
    const fields = schemas.systems[system.name]?.fields;
    if (!fields) {
      return;
    }
    reconcileFields(
      system.options ?? {},
      fields,
      ['systems', `name:${system.name}`, 'options'],
      schemas,
      fixes,
    );
  });
};

const reconcileComponents = (
  basePath: string[],
  components: ComponentConfig[],
  schemas: ReconcileSchemas,
  fixes: ReconcileFix[],
): void => {
  components.forEach((component) => {
    const fields = schemas.components[component.name]?.fields;
    if (!fields) {
      return;
    }
    reconcileFields(
      component.config ?? {},
      fields,
      [...basePath, `name:${component.name}`, 'config'],
      schemas,
      fixes,
    );
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
      reconcileFields(
        asset.data ?? {},
        schema.fields,
        ['assets', `id:${asset.id}`, 'data'],
        schemas,
        fixes,
      );
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
