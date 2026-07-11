import { DynamicAABBTree } from '.';
import type { AABB } from '../types';

const createAABB = (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): AABB => ({
  min: { x: minX, y: minY },
  max: { x: maxX, y: maxY },
});

const queryIds = (
  tree: DynamicAABBTree<string>,
  aabb: AABB,
): string[] => tree.queryAll(aabb).sort();

describe('PhysicsSystem -> collision-detection -> DynamicAABBTree', () => {
  it('Returns no values from an empty tree', () => {
    const tree = new DynamicAABBTree<string>();

    expect(queryIds(tree, createAABB(0, 0, 10, 10))).toStrictEqual([]);
    expect(tree.size).toBe(0);
  });

  it('Returns values whose AABBs overlap the query AABB', () => {
    const tree = new DynamicAABBTree<string>();

    tree.insert(createAABB(0, 0, 2, 2), 'a');
    tree.insert(createAABB(3, 3, 5, 5), 'b');
    tree.insert(createAABB(10, 10, 12, 12), 'c');

    expect(queryIds(tree, createAABB(1, 1, 4, 4))).toStrictEqual(['a', 'b']);
  });

  it('Treats touching AABB edges as overlap', () => {
    const tree = new DynamicAABBTree<string>();

    tree.insert(createAABB(0, 0, 2, 2), 'a');

    expect(queryIds(tree, createAABB(2, 2, 4, 4))).toStrictEqual(['a']);
  });

  it('Removes entries by id', () => {
    const tree = new DynamicAABBTree<string>();
    const first = tree.insert(createAABB(0, 0, 2, 2), 'a');

    tree.insert(createAABB(1, 1, 3, 3), 'b');
    tree.remove(first);

    expect(queryIds(tree, createAABB(0, 0, 4, 4))).toStrictEqual(['b']);
    expect(tree.size).toBe(1);
  });

  it('Updates an entry by id while keeping the same id valid', () => {
    const tree = new DynamicAABBTree<string>();
    const id = tree.insert(createAABB(0, 0, 2, 2), 'a');

    tree.update(id, createAABB(10, 10, 12, 12));

    expect(queryIds(tree, createAABB(0, 0, 2, 2))).toStrictEqual([]);
    expect(queryIds(tree, createAABB(9, 9, 13, 13))).toStrictEqual(['a']);

    tree.update(id, createAABB(-2, -2, -1, -1));

    expect(queryIds(tree, createAABB(9, 9, 13, 13))).toStrictEqual([]);
    expect(queryIds(tree, createAABB(-3, -3, 0, 0))).toStrictEqual(['a']);
  });

  it('Supports removing the root entry', () => {
    const tree = new DynamicAABBTree<string>();
    const id = tree.insert(createAABB(0, 0, 2, 2), 'a');

    tree.remove(id);

    expect(queryIds(tree, createAABB(0, 0, 2, 2))).toStrictEqual([]);
    expect(tree.size).toBe(0);
  });

  it('Stops query traversal when the visitor returns false', () => {
    const tree = new DynamicAABBTree<string>();
    const visited: string[] = [];

    tree.insert(createAABB(0, 0, 2, 2), 'a');
    tree.insert(createAABB(1, 1, 3, 3), 'b');
    tree.insert(createAABB(2, 2, 4, 4), 'c');

    tree.query(createAABB(0, 0, 4, 4), (value) => {
      visited.push(value);

      return false;
    });

    expect(visited).toHaveLength(1);
  });

  it('Can reuse an output array for queryAll', () => {
    const tree = new DynamicAABBTree<string>();
    const output = ['existing'];

    tree.insert(createAABB(0, 0, 2, 2), 'a');

    expect(tree.queryAll(createAABB(0, 0, 2, 2), output)).toBe(output);
    expect(output.sort()).toStrictEqual(['a', 'existing']);
  });

  it('Clears entries without reusing old ids', () => {
    const tree = new DynamicAABBTree<string>();
    const oldId = tree.insert(createAABB(0, 0, 2, 2), 'a');

    tree.clear();
    const newId = tree.insert(createAABB(0, 0, 2, 2), 'b');

    expect(newId).not.toBe(oldId);
    expect(queryIds(tree, createAABB(0, 0, 2, 2))).toStrictEqual(['b']);
    expect(() => tree.remove(oldId)).toThrow(
      'DynamicAABBTree entry 1 does not exist.',
    );
  });

  it('Throws when updating or removing an unknown id', () => {
    const tree = new DynamicAABBTree<string>();

    expect(() => tree.update(1, createAABB(0, 0, 1, 1))).toThrow(
      'DynamicAABBTree entry 1 does not exist.',
    );
    expect(() => tree.remove(1)).toThrow(
      'DynamicAABBTree entry 1 does not exist.',
    );
  });

  it('Keeps query results correct after many inserts, updates, and removals', () => {
    const tree = new DynamicAABBTree<string>();
    const ids: number[] = [];

    for (let index = 0; index < 32; index += 1) {
      ids[index] = tree.insert(
        createAABB(index * 3, 0, index * 3 + 1, 1),
        `${index}`,
      );
    }

    ids.forEach((id, index) => {
      if (index % 2 === 0) {
        tree.update(id, createAABB(100 + index, 0, 101 + index, 1));
      }
    });

    ids.forEach((id, index) => {
      if (index % 4 === 1) {
        tree.remove(id);
      }
    });

    expect(queryIds(tree, createAABB(0, 0, 96, 1))).toStrictEqual(
      ids
        .map((_, index) => index)
        .filter((index) => index % 2 === 1 && index % 4 !== 1)
        .map((index) => `${index}`)
        .sort(),
    );
    expect(queryIds(tree, createAABB(100, 0, 132, 1))).toStrictEqual(
      ids
        .map((_, index) => index)
        .filter((index) => index % 2 === 0)
        .map((index) => `${index}`)
        .sort(),
    );
  });

  it('Supports nested queries issued from within a visitor', () => {
    const tree = new DynamicAABBTree<string>();

    tree.insert(createAABB(0, 0, 2, 2), 'a');
    tree.insert(createAABB(3, 3, 5, 5), 'b');
    tree.insert(createAABB(10, 10, 12, 12), 'c');

    const outer: string[] = [];
    const nested: string[][] = [];

    tree.query(createAABB(0, 0, 12, 12), (value) => {
      outer.push(value);
      nested.push(tree.queryAll(createAABB(3, 3, 5, 5)).sort());
    });

    expect(outer.sort()).toStrictEqual(['a', 'b', 'c']);
    nested.forEach((result) => {
      expect(result).toStrictEqual(['b']);
    });
  });
});
