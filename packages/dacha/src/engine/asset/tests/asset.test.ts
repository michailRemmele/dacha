import { Asset } from '../asset';
import type { AssetOptions } from '../asset';

interface ItemData {
  damage?: number;
}

class Item extends Asset {
  damage: number;

  constructor(options: AssetOptions<ItemData>) {
    super(options);

    this.damage = options.data.damage ?? 0;
  }
}

Item.assetName = 'item';

describe('Asset', () => {
  it('exposes id and name from options', () => {
    const item = new Item({ id: 'a1', name: 'Sword', data: { damage: 10 } });

    expect(item.id).toBe('a1');
    expect(item.name).toBe('Sword');
  });

  it('lets a subclass read its own data', () => {
    const item = new Item({ id: 'a1', name: 'Sword', data: { damage: 10 } });
    const bare = new Item({ id: 'a2', name: 'Stick', data: {} });

    expect(item.damage).toBe(10);
    expect(bare.damage).toBe(0);
  });

  it('carries the kind name on the constructor', () => {
    expect(Item.assetName).toBe('item');
  });
});
