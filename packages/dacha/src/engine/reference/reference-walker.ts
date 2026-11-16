import { getSchema } from '../decorators';
import type {
  Field,
  ReferenceField,
  ReferenceType,
  Schema,
} from '../decorators';
import type {
  ActorConfig,
  AssetConfig,
  SystemConfig,
  TemplateConfig,
} from '../types';

const REFERENCE_TYPES = new Set<string>([
  'asset',
  'template',
  'scene',
  'actor',
] satisfies ReferenceType[]);

const isReferenceField = (field: Field): field is ReferenceField =>
  REFERENCE_TYPES.has(field.type);

/**
 * A reference to a project entity.
 *
 * @internal
 */
export interface Reference {
  /** What the reference points at. */
  type: ReferenceType;
  /** The id it holds. */
  id: string;
}

/**
 * Configuration to look for references in.
 *
 * @internal
 */
export interface ReferenceSources {
  /** System configurations; their options are read. */
  systems?: SystemConfig[];
  /** Actor configurations, with their children. */
  actors?: ActorConfig[];
  /** Template configurations, with their children. */
  templates?: TemplateConfig[];
  /** Asset configurations; their data is read. */
  assets?: AssetConfig[];
}

/**
 * Called for each reference. Returning a string replaces the reference's value in place.
 *
 * @internal
 */
export type ReferenceVisitor = (reference: Reference) => string | undefined;

type ConfigData = Record<string, unknown> | undefined;

/**
 * Finds the references to project entities in raw configuration data, by the schemas of
 * the classes the data belongs to, and can rewrite them.
 *
 * @internal
 */
export class ReferenceWalker {
  private schemas: Map<string, Schema>;

  /**
   * @param classes - The classes the configuration data belongs to: components, systems,
   * assets and scripts. Values without a schema are skipped.
   */
  constructor(classes: unknown[]) {
    this.schemas = new Map();
    classes.forEach((value) => {
      const schema = getSchema(value);
      if (schema) {
        this.schemas.set(`${schema.kind}:${schema.name}`, schema);
      }
    });
  }

  /** Calls `visitor` for every reference in `sources`. */
  visit(sources: ReferenceSources, visitor: ReferenceVisitor): void {
    sources.systems?.forEach((config) =>
      this.visitData(
        config.options,
        this.schemas.get(`system:${config.name}`),
        visitor,
      ),
    );
    sources.actors?.forEach((actor) => this.visitEntity(actor, visitor));
    sources.templates?.forEach((template) =>
      this.visitEntity(template, visitor),
    );
    sources.assets?.forEach((config) =>
      this.visitData(
        config.data,
        this.schemas.get(`asset:${config.kind}`),
        visitor,
      ),
    );
  }

  /** Returns the references of the given types, in the order they are found. */
  find(sources: ReferenceSources, types: ReferenceType[]): Reference[] {
    const references: Reference[] = [];
    this.visit(sources, (reference) => {
      if (types.includes(reference.type)) {
        references.push(reference);
      }
      return undefined;
    });
    return references;
  }

  /** Returns the ids of the references of one type. */
  collect(sources: ReferenceSources, type: ReferenceType): Set<string> {
    return new Set(this.find(sources, [type]).map(({ id }) => id));
  }

  private visitEntity(
    entity: ActorConfig | TemplateConfig,
    visitor: ReferenceVisitor,
  ): void {
    if ('templateId' in entity && entity.templateId) {
      const next = visitor({ type: 'template', id: entity.templateId });
      if (typeof next === 'string') {
        entity.templateId = next;
      }
    }
    entity.components.forEach((component) =>
      this.visitData(
        component.config,
        this.schemas.get(`component:${component.name}`),
        visitor,
      ),
    );
    (entity.children as (ActorConfig | TemplateConfig)[]).forEach((child) =>
      this.visitEntity(child, visitor),
    );
  }

  private visitData(
    data: ConfigData,
    schema: Schema | undefined,
    visitor: ReferenceVisitor,
  ): void {
    if (!data || !schema) {
      return;
    }

    schema.fields.forEach((field) => {
      if (isReferenceField(field)) {
        this.visitReference(data, field, visitor);
        return;
      }
      if (field.type === 'script') {
        this.visitScripts(data[field.name], field, visitor);
      }
    });
  }

  private visitReference(
    data: Record<string, unknown>,
    field: ReferenceField,
    visitor: ReferenceVisitor,
  ): void {
    const report = (id: unknown): string | undefined =>
      typeof id === 'string' && id
        ? visitor({ type: field.type, id })
        : undefined;

    const value = data[field.name];
    if (Array.isArray(value)) {
      value.forEach((id, index) => {
        const next = report(id);
        if (typeof next === 'string') {
          value[index] = next;
        }
      });
      return;
    }

    const next = report(value);
    if (typeof next === 'string') {
      data[field.name] = next;
    }
  }

  private visitScripts(
    value: unknown,
    field: Field & { type: 'script' },
    visitor: ReferenceVisitor,
  ): void {
    const entries = Array.isArray(value) ? value : value ? [value] : [];
    entries.forEach((entry: unknown) => {
      if (typeof entry !== 'object' || entry === null) {
        return;
      }
      const { name, options } = entry as { name?: unknown; options?: unknown };
      if (typeof name !== 'string') {
        return;
      }
      this.visitData(
        options as ConfigData,
        this.schemas.get(`${field.kind}:${name}`),
        visitor,
      );
    });
  }
}
