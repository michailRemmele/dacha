import type { FC } from 'react';
import {
  getSchema,
  type Schema,
  type SchemaKind,
  type ComponentConstructor,
  type SystemConstructor,
  type AssetConstructor,
  type BehaviorConstructor,
} from 'dacha';
import type {
  ShaderConstructor,
  FilterEffectConstructor,
} from 'dacha/renderer';

import type {
  WidgetProps,
  WidgetSchema,
  IconName,
} from '../types/widget-schema';
import {
  NAMESPACE_EDITOR,
  NAMESPACE_EXTENSION,
} from '../view/providers/schemas-provider/consts';
import { widgetRegistry } from '../hocs/widget-registry';

import { BUILTIN_CANDIDATES, builtinViews } from './builtins';

export interface SchemaEntry<T = unknown> {
  name: string;
  schema: WidgetSchema;
  namespace: string;
  /** The decorated class. */
  class: T;
}

export interface CollectedSchemas {
  components: SchemaEntry<ComponentConstructor>[];
  systems: SchemaEntry<SystemConstructor>[];
  assets: SchemaEntry<AssetConstructor>[];
  behaviors: SchemaEntry<BehaviorConstructor>[];
  shaders: SchemaEntry<ShaderConstructor>[];
  filterEffects: SchemaEntry<FilterEffectConstructor>[];
}

/** The group of {@link CollectedSchemas} that holds each schema kind. */
export const SCHEMA_GROUPS: Record<SchemaKind, keyof CollectedSchemas> = {
  component: 'components',
  system: 'systems',
  asset: 'assets',
  behavior: 'behaviors',
  shader: 'shaders',
  filterEffect: 'filterEffects',
};

const resolveView = (name: string): FC<WidgetProps> | undefined =>
  builtinViews[name] ?? widgetRegistry.getWidget(name);

const toWidget = ({
  name,
  title,
  icon,
  sections,
  fields,
}: Schema): WidgetSchema => ({
  title,
  icon: icon as IconName | undefined,
  sections,
  fields,
  view: resolveView(name),
});

const exportsOf = (module: unknown): unknown[] =>
  module !== null && typeof module === 'object' ? Object.values(module) : [];

/**
 * Builds the editor's schemas from the values that carry a `Define*` decorator
 * among the editor's built-in candidates and the exports of the project's modules.
 * Every group is sorted by name, so lists that offer classes need no sorting.
 */
export const collectSchemas = (modules: unknown[]): CollectedSchemas => {
  const candidates = [
    ...BUILTIN_CANDIDATES.map((value) => ({
      value,
      namespace: NAMESPACE_EDITOR,
    })),
    ...modules
      .flatMap(exportsOf)
      .map((value) => ({ value, namespace: NAMESPACE_EXTENSION })),
  ];

  const seen = new Set<unknown>();
  const found = candidates.flatMap(({ value, namespace }) => {
    const schema = getSchema(value);
    if (!schema || seen.has(value)) {
      return [];
    }
    seen.add(value);
    return [{ value, namespace, schema }];
  });
  found.sort((a, b) => a.schema.name.localeCompare(b.schema.name));

  const result: CollectedSchemas = {
    components: [],
    systems: [],
    assets: [],
    behaviors: [],
    shaders: [],
    filterEffects: [],
  };

  found.forEach(({ value, namespace, schema }) => {
    (result[SCHEMA_GROUPS[schema.kind]] as SchemaEntry[]).push({
      name: schema.name,
      schema: toWidget(schema),
      namespace,
      class: value,
    });
  });

  return result;
};
