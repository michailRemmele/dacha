import type { AABB } from '../types';

export type DynamicAABBTreeEntryId = number;

interface DynamicAABBTreeNode<T> {
  id: DynamicAABBTreeEntryId;
  aabb: AABB;
  value: T | null;
  parent: DynamicAABBTreeNode<T> | null;
  child1: DynamicAABBTreeNode<T> | null;
  child2: DynamicAABBTreeNode<T> | null;
  height: number;
}

const isLeaf = <T>(node: DynamicAABBTreeNode<T>): boolean =>
  node.child1 === null;

const createAABB = (): AABB => ({
  min: { x: 0, y: 0 },
  max: { x: 0, y: 0 },
});

const setCombinedAABB = (target: AABB, aabb1: AABB, aabb2: AABB): void => {
  target.min.x = Math.min(aabb1.min.x, aabb2.min.x);
  target.min.y = Math.min(aabb1.min.y, aabb2.min.y);
  target.max.x = Math.max(aabb1.max.x, aabb2.max.x);
  target.max.y = Math.max(aabb1.max.y, aabb2.max.y);
};

const getPerimeter = (aabb: AABB): number =>
  2 *
  (Math.max(0, aabb.max.x - aabb.min.x) +
    Math.max(0, aabb.max.y - aabb.min.y));

const getCombinedPerimeter = (aabb1: AABB, aabb2: AABB): number => {
  const minX = Math.min(aabb1.min.x, aabb2.min.x);
  const minY = Math.min(aabb1.min.y, aabb2.min.y);
  const maxX = Math.max(aabb1.max.x, aabb2.max.x);
  const maxY = Math.max(aabb1.max.y, aabb2.max.y);

  return 2 * (Math.max(0, maxX - minX) + Math.max(0, maxY - minY));
};

const overlaps = (aabb1: AABB, aabb2: AABB): boolean =>
  aabb1.max.x >= aabb2.min.x &&
  aabb1.min.x <= aabb2.max.x &&
  aabb1.max.y >= aabb2.min.y &&
  aabb1.min.y <= aabb2.max.y;

export class DynamicAABBTree<T> {
  private root: DynamicAABBTreeNode<T> | null = null;
  private nodesById = new Map<DynamicAABBTreeEntryId, DynamicAABBTreeNode<T>>();
  private freeInternalNodes: DynamicAABBTreeNode<T>[] = [];
  private queryStack: DynamicAABBTreeNode<T>[] = [];
  private nextId = 1;

  get size(): number {
    return this.nodesById.size;
  }

  insert(aabb: AABB, value: T): DynamicAABBTreeEntryId {
    const node = this.createNode(aabb, value);

    this.nodesById.set(node.id, node);
    this.insertLeaf(node);

    return node.id;
  }

  update(id: DynamicAABBTreeEntryId, aabb: AABB): void {
    const node = this.getNode(id);

    this.removeLeaf(node);
    node.aabb = aabb;
    this.insertLeaf(node);
  }

  remove(id: DynamicAABBTreeEntryId): void {
    const node = this.getNode(id);

    this.removeLeaf(node);
    this.nodesById.delete(id);
  }

  query(aabb: AABB, visitor: (value: T) => unknown): void {
    if (!this.root) {
      return;
    }

    const stack = this.queryStack;

    stack.length = 0;
    stack.push(this.root);

    while (stack.length > 0) {
      const node = stack.pop()!;

      if (!overlaps(node.aabb, aabb)) {
        continue;
      }

      if (isLeaf(node)) {
        if (visitor(node.value as T) === false) {
          stack.length = 0;
          return;
        }

        continue;
      }

      stack.push(node.child1!, node.child2!);
    }
  }

  queryAll(aabb: AABB, output: T[] = []): T[] {
    this.query(aabb, (value) => {
      output.push(value);
    });

    return output;
  }

  clear(): void {
    this.root = null;
    this.nodesById.clear();
    this.freeInternalNodes.length = 0;
    this.queryStack.length = 0;
  }

  private createNode(aabb: AABB, value: T): DynamicAABBTreeNode<T> {
    return {
      id: this.nextId++,
      aabb,
      value,
      parent: null,
      child1: null,
      child2: null,
      height: 0,
    };
  }

  private getNode(id: DynamicAABBTreeEntryId): DynamicAABBTreeNode<T> {
    const node = this.nodesById.get(id);

    if (!node) {
      throw new Error(`DynamicAABBTree entry ${id} does not exist.`);
    }

    return node;
  }

  private insertLeaf(leaf: DynamicAABBTreeNode<T>): void {
    if (!this.root) {
      this.root = leaf;
      leaf.parent = null;
      return;
    }

    const sibling = this.findBestSibling(leaf.aabb);
    const oldParent = sibling.parent;
    const newParent = this.createInternalNode(leaf, sibling, oldParent);

    sibling.parent = newParent;
    leaf.parent = newParent;

    if (oldParent) {
      if (oldParent.child1 === sibling) {
        oldParent.child1 = newParent;
      } else {
        oldParent.child2 = newParent;
      }
    } else {
      this.root = newParent;
    }

    this.fixAncestors(leaf.parent);
  }

  private removeLeaf(leaf: DynamicAABBTreeNode<T>): void {
    if (leaf === this.root) {
      this.root = null;
      leaf.parent = null;
      return;
    }

    const parent = leaf.parent!;
    const grandParent = parent.parent;
    const sibling = parent.child1 === leaf ? parent.child2! : parent.child1!;

    if (grandParent) {
      if (grandParent.child1 === parent) {
        grandParent.child1 = sibling;
      } else {
        grandParent.child2 = sibling;
      }

      sibling.parent = grandParent;
      this.fixAncestors(grandParent);
    } else {
      this.root = sibling;
      sibling.parent = null;
    }

    leaf.parent = null;
    this.releaseInternalNode(parent);
  }

  private createInternalNode(
    leaf: DynamicAABBTreeNode<T>,
    sibling: DynamicAABBTreeNode<T>,
    parent: DynamicAABBTreeNode<T> | null,
  ): DynamicAABBTreeNode<T> {
    const node = this.freeInternalNodes.pop() ?? {
      id: 0,
      aabb: createAABB(),
      value: null,
      parent: null,
      child1: null,
      child2: null,
      height: 0,
    };

    setCombinedAABB(node.aabb, leaf.aabb, sibling.aabb);
    node.value = null;
    node.parent = parent;
    node.child1 = sibling;
    node.child2 = leaf;
    node.height = sibling.height + 1;

    return node;
  }

  private releaseInternalNode(node: DynamicAABBTreeNode<T>): void {
    node.value = null;
    node.parent = null;
    node.child1 = null;
    node.child2 = null;
    node.height = 0;

    this.freeInternalNodes.push(node);
  }

  private findBestSibling(aabb: AABB): DynamicAABBTreeNode<T> {
    let node = this.root!;

    while (!isLeaf(node)) {
      const child1 = node.child1!;
      const child2 = node.child2!;
      const area = getPerimeter(node.aabb);
      const combinedArea = getCombinedPerimeter(node.aabb, aabb);

      const inheritedCost = 2 * (combinedArea - area);
      const cost = 2 * combinedArea;
      const cost1 = this.getDescentCost(child1, aabb, inheritedCost);
      const cost2 = this.getDescentCost(child2, aabb, inheritedCost);

      if (cost < cost1 && cost < cost2) {
        break;
      }

      node = cost1 < cost2 ? child1 : child2;
    }

    return node;
  }

  private getDescentCost(
    child: DynamicAABBTreeNode<T>,
    aabb: AABB,
    inheritedCost: number,
  ): number {
    const combinedArea = getCombinedPerimeter(child.aabb, aabb);

    if (isLeaf(child)) {
      return combinedArea + inheritedCost;
    }

    return combinedArea - getPerimeter(child.aabb) + inheritedCost;
  }

  private fixAncestors(node: DynamicAABBTreeNode<T> | null): void {
    while (node) {
      node = this.balance(node);

      const child1 = node.child1!;
      const child2 = node.child2!;

      node.height = 1 + Math.max(child1.height, child2.height);
      setCombinedAABB(node.aabb, child1.aabb, child2.aabb);

      node = node.parent;
    }
  }

  private balance(node: DynamicAABBTreeNode<T>): DynamicAABBTreeNode<T> {
    if (isLeaf(node) || node.height < 2) {
      return node;
    }

    const child1 = node.child1!;
    const child2 = node.child2!;
    const balance = child2.height - child1.height;

    if (balance > 1) {
      return this.rotateLeft(node);
    }

    if (balance < -1) {
      return this.rotateRight(node);
    }

    return node;
  }

  private rotateLeft(node: DynamicAABBTreeNode<T>): DynamicAABBTreeNode<T> {
    const child1 = node.child1!;
    const child2 = node.child2!;
    const grandChild1 = child2.child1!;
    const grandChild2 = child2.child2!;

    child2.child1 = node;
    child2.parent = node.parent;
    node.parent = child2;

    if (child2.parent) {
      if (child2.parent.child1 === node) {
        child2.parent.child1 = child2;
      } else {
        child2.parent.child2 = child2;
      }
    } else {
      this.root = child2;
    }

    if (grandChild1.height > grandChild2.height) {
      child2.child2 = grandChild1;
      node.child2 = grandChild2;
      grandChild2.parent = node;
    } else {
      child2.child2 = grandChild2;
      node.child2 = grandChild1;
      grandChild1.parent = node;
    }

    setCombinedAABB(node.aabb, child1.aabb, node.child2!.aabb);
    setCombinedAABB(child2.aabb, node.aabb, child2.child2!.aabb);

    node.height = 1 + Math.max(child1.height, node.child2!.height);
    child2.height = 1 + Math.max(node.height, child2.child2!.height);

    return child2;
  }

  private rotateRight(node: DynamicAABBTreeNode<T>): DynamicAABBTreeNode<T> {
    const child1 = node.child1!;
    const child2 = node.child2!;
    const grandChild1 = child1.child1!;
    const grandChild2 = child1.child2!;

    child1.child1 = node;
    child1.parent = node.parent;
    node.parent = child1;

    if (child1.parent) {
      if (child1.parent.child1 === node) {
        child1.parent.child1 = child1;
      } else {
        child1.parent.child2 = child1;
      }
    } else {
      this.root = child1;
    }

    if (grandChild1.height > grandChild2.height) {
      child1.child2 = grandChild1;
      node.child1 = grandChild2;
      grandChild2.parent = node;
    } else {
      child1.child2 = grandChild2;
      node.child1 = grandChild1;
      grandChild1.parent = node;
    }

    setCombinedAABB(node.aabb, node.child1!.aabb, child2.aabb);
    setCombinedAABB(child1.aabb, node.aabb, child1.child2!.aabb);

    node.height = 1 + Math.max(node.child1!.height, child2.height);
    child1.height = 1 + Math.max(node.height, child1.child2!.height);

    return child1;
  }
}
