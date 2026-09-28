import type { FC } from 'react';
import { getSchema, type Schema, type RendererAPI } from 'dacha';

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

export interface SchemaEntry {
  name: string;
  schema: WidgetSchema;
  namespace: string;
}

type ShaderClass = Parameters<RendererAPI['reloadShaders']>[0][number];

export interface CollectedSchemas {
  components: SchemaEntry[];
  systems: SchemaEntry[];
  assets: SchemaEntry[];
  /** Keyed by behavior type; '' holds behaviors without a type. */
  behaviors: Record<string, Record<string, WidgetSchema>>;
  /** Shader classes, which the renderer needs to compile the project's materials. */
  shaders: ShaderClass[];
}

const KIND_TO_GROUP = {
  component: 'components',
  system: 'systems',
  asset: 'assets',
} as const;

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
    behaviors: {},
    shaders: [],
  };

  found.forEach(({ value, namespace, schema }) => {
    const widget = toWidget(schema);

    if (schema.kind !== 'behavior') {
      result[KIND_TO_GROUP[schema.kind]].push({
        name: schema.name,
        schema: widget,
        namespace,
      });
      return;
    }

    const type = schema.type ?? '';
    (result.behaviors[type] ??= {})[schema.name] = widget;
    if (type === 'shader') {
      result.shaders.push(value as ShaderClass);
    }
  });

  return result;
};
