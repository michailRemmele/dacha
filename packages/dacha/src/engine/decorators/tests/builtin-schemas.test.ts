// The barrel loads the renderer, whose pixi.js import is ESM that Jest cannot run.
// Nothing here renders, so every pixi.js export is an empty class.
jest.mock(
  'pixi.js',
  () =>
    new Proxy(
      {},
      {
        get: (_target, key): unknown =>
          key === '__esModule' ? false : class {},
      },
    ),
);

import * as Dacha from '../../../index';
import { getSchema } from '..';

import fixture from './builtin-schemas.json';
import { normalizeSchema } from './normalize-schema';

type Group = 'components' | 'systems' | 'assets';
const NAME_KEY: Record<Group, string> = {
  components: 'componentName',
  systems: 'systemName',
  assets: 'assetName',
};
const KIND: Record<Group, string> = {
  components: 'component',
  systems: 'system',
  assets: 'asset',
};

const byName = (group: Group, name: string): unknown =>
  Object.values(Dacha).find(
    (value) =>
      typeof value === 'function' &&
      (value as unknown as Record<string, unknown>)[NAME_KEY[group]] === name &&
      getSchema(value),
  );

describe.each(['components', 'systems', 'assets'] as Group[])(
  'built-in %s',
  (group) => {
    it.each(Object.keys(fixture[group]))(
      '%s matches the editor schema it replaces',
      (name) => {
        const schema = getSchema(byName(group, name));

        expect(schema).toMatchObject({ kind: KIND[group], name });
        expect(normalizeSchema(schema as never)).toEqual(
          (fixture[group] as Record<string, unknown>)[name],
        );
      },
    );
  },
);

it('PixiView has a name and no fields', () => {
  expect(Dacha.PixiView.componentName).toBe('PixiView');
  expect(getSchema(Dacha.PixiView)?.fields).toEqual([]);
});
