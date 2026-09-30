const SCHEMA = Symbol('schema');
jest.mock('dacha', () => ({
  getSchema: (value: unknown): unknown =>
    typeof value === 'function'
      ? (value as unknown as Record<symbol, unknown>)[SCHEMA]
      : undefined,
}));

const mockBuiltins: unknown[] = [];
const mockBuiltinViews: Record<string, unknown> = {};
const mockWidgets: Record<string, unknown> = {};
jest.mock('../builtins', () => ({
  BUILTIN_CANDIDATES: mockBuiltins,
  builtinViews: mockBuiltinViews,
}));
jest.mock('../../hocs/widget-registry', () => ({
  widgetRegistry: {
    getWidget: (name: string): unknown => mockWidgets[name],
  },
}));

import { collectSchemas } from '../collect-schemas';
import {
  NAMESPACE_EDITOR,
  NAMESPACE_EXTENSION,
} from '../../view/providers/schemas-provider/consts';

const cls = (schema: object): unknown =>
  Object.assign(function Cls(): void {}, { [SCHEMA]: schema });

const Sprite = cls({
  kind: 'component',
  name: 'Sprite',
  icon: 'Picture',
  fields: [],
});
const Renderer = cls({ kind: 'system', name: 'Renderer', fields: [] });
const Move = cls({
  kind: 'component',
  name: 'Move',
  fields: [{ name: 'speed', type: 'number' }],
});
const Wave = cls({ kind: 'shader', name: 'Wave', fields: [] });
const Patrol = cls({ kind: 'behavior', name: 'Patrol', fields: [] });
const Blur = cls({ kind: 'filterEffect', name: 'Blur', fields: [] });
const Tex = cls({ kind: 'asset', name: 'tex', fields: [] });

const View = (): null => null;
const ProjectView = (): null => null;

const setBuiltins = (...values: unknown[]): void => {
  mockBuiltins.splice(0, mockBuiltins.length, ...values);
};

beforeEach(() => {
  setBuiltins();
  Object.keys(mockBuiltinViews).forEach((key) => delete mockBuiltinViews[key]);
  Object.keys(mockWidgets).forEach((key) => delete mockWidgets[key]);
});

describe('collectSchemas', () => {
  it('puts built-ins in the editor namespace and project classes in the extension one', () => {
    setBuiltins(Sprite, Renderer);
    const result = collectSchemas([{ default: Move }]);

    expect(result.components).toEqual([
      {
        name: 'Move',
        namespace: NAMESPACE_EXTENSION,
        schema: { fields: [{ name: 'speed', type: 'number' }] },
        class: Move,
      },
      {
        name: 'Sprite',
        namespace: NAMESPACE_EDITOR,
        schema: { icon: 'Picture', fields: [] },
        class: Sprite,
      },
    ]);
    expect(result.systems.map((e) => e.name)).toEqual(['Renderer']);
  });

  it('reads default and named exports, once per class', () => {
    const result = collectSchemas([{ default: Move, Move }, { Move }, { Tex }]);

    expect(result.components.map((e) => e.name)).toEqual(['Move']);
    expect(result.assets.map((e) => e.name)).toEqual(['tex']);
  });

  it('puts every kind in its own group and keeps the class on the entry', () => {
    const result = collectSchemas([
      { default: Wave },
      { default: Patrol },
      { default: Blur },
    ]);

    expect(result.shaders.map((e) => e.name)).toEqual(['Wave']);
    expect(result.shaders[0].class).toBe(Wave);
    expect(result.behaviors.map((e) => e.name)).toEqual(['Patrol']);
    expect(result.filterEffects.map((e) => e.name)).toEqual(['Blur']);
    expect(Object.keys(result).sort()).toEqual([
      'assets',
      'behaviors',
      'components',
      'filterEffects',
      'shaders',
      'systems',
    ]);
  });

  it('classifies by schema kind, not by which module exported the class', () => {
    const result = collectSchemas([{ Patrol, Wave, Blur, Move }]);

    expect(result.behaviors.map((e) => e.name)).toEqual(['Patrol']);
    expect(result.shaders.map((e) => e.name)).toEqual(['Wave']);
    expect(result.filterEffects.map((e) => e.name)).toEqual(['Blur']);
  });

  it('sorts every group by name, mixing built-ins and project classes', () => {
    const Zoom = cls({ kind: 'component', name: 'Zoom', fields: [] });
    const Audio = cls({ kind: 'asset', name: 'audio', fields: [] });
    const Ash = cls({ kind: 'shader', name: 'Ash', fields: [] });

    setBuiltins(Zoom, Sprite, Tex, Wave);
    const result = collectSchemas([{ Move, Audio, Ash }]);

    expect(result.components.map((e) => e.name)).toEqual([
      'Move',
      'Sprite',
      'Zoom',
    ]);
    expect(result.assets.map((e) => e.name)).toEqual(['audio', 'tex']);
    expect(result.shaders.map((e) => e.name)).toEqual(['Ash', 'Wave']);
  });

  it('resolves views by name, from the registry for project classes', () => {
    setBuiltins(Renderer);
    mockBuiltinViews.Renderer = View;
    mockWidgets.Move = ProjectView;

    const result = collectSchemas([{ Move }]);

    expect(result.systems[0].schema.view).toBe(View);
    expect(result.components[0].schema.view).toBe(ProjectView);
  });

  it('keeps a built-in view when the project registers one with the same name', () => {
    setBuiltins(Renderer);
    mockBuiltinViews.Renderer = View;
    mockWidgets.Renderer = ProjectView;

    expect(collectSchemas([]).systems[0].schema.view).toBe(View);
  });

  it('ignores exports without a schema', () => {
    const modules = [
      undefined,
      null,
      1,
      'x',
      { a: 1, b: null, c: (): number => 1, d: class {}, e: { [SCHEMA]: {} } },
    ];

    expect(() => collectSchemas(modules)).not.toThrow();
    expect(collectSchemas(modules).components).toEqual([]);
  });

  it('returns only built-ins when the project has no modules', () => {
    setBuiltins(Sprite);
    expect(collectSchemas([]).components).toHaveLength(1);
  });

  it('returns fresh objects on every call', () => {
    const first = collectSchemas([{ default: Move }]);
    const second = collectSchemas([]);

    expect(first.components).toHaveLength(1);
    expect(second.components).toHaveLength(0);
  });
});
