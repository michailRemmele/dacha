import { copyAssets } from '../copy-assets';
import { ADD_VALUES } from '../../../../command-types';

interface Asset {
  id: string;
  name: string;
  kind: string;
  data: Record<string, unknown>;
}

const makeGetState =
  (assets: Asset[]) =>
  (path: string[]): unknown => {
    if (path.length === 1) {
      return assets;
    }
    const id = path[1].replace('id:', '');
    return assets.find((asset) => asset.id === id);
  };

describe('copyAssets', () => {
  it('duplicates an asset with a new id, unique name and same kind', () => {
    const assets: Asset[] = [
      { id: 'a1', name: 'Hero', kind: 'texture', data: { src: 'h.png' } },
    ];
    const dispatched: unknown[] = [];

    copyAssets([['assets', 'id:a1']])(
      (cmd) => dispatched.push(cmd),
      makeGetState(assets),
    );

    expect(dispatched).toHaveLength(1);
    const cmd = dispatched[0] as {
      command: string;
      options: { path: string[]; values: Asset[] };
    };
    expect(cmd.command).toBe(ADD_VALUES);
    expect(cmd.options.path).toEqual(['assets']);
    expect(cmd.options.values).toHaveLength(1);

    const dup = cmd.options.values[0];
    expect(dup.id).not.toBe('a1');
    expect(typeof dup.id).toBe('string');
    expect(dup.name).toBe('Hero 2');
    expect(dup.kind).toBe('texture');
    expect(dup.data).toEqual({ src: 'h.png' });
  });

  it('does not dispatch when no source assets resolve', () => {
    const dispatched: unknown[] = [];
    copyAssets([['assets', 'id:missing']])(
      (cmd) => dispatched.push(cmd),
      makeGetState([]),
    );
    expect(dispatched).toHaveLength(0);
  });
});
