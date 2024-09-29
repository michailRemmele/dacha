import type { CollisionEntry } from '../types';

export class PairTracker<T = CollisionEntry> {
  private pairMap: Map<T, Set<T>>;
  private prevPairMap?: Map<T, Set<T>>;

  constructor() {
    this.pairMap = new Map();
  }

  add(entry1: T, entry2: T): void {
    if (this.prevPairMap && !this.prevPairMap.get(entry1)?.has(entry2)) {
      return;
    }

    if (!this.pairMap.has(entry1)) {
      this.pairMap.set(entry1, new Set());
    }
    if (!this.pairMap.has(entry2)) {
      this.pairMap.set(entry2, new Set());
    }

    this.pairMap.get(entry1)!.add(entry2);
    this.pairMap.get(entry2)!.add(entry1);
  }

  canCollide(entry: T): boolean {
    if (!this.prevPairMap) {
      return true;
    }

    return this.prevPairMap.has(entry);
  }

  swap(): void {
    this.prevPairMap = this.pairMap;
    this.pairMap = new Map();
  }

  values(): [T, T][] {
    const uniquePairMap: Map<T, Set<T>> = new Map();

    this.pairMap.forEach((entries, entry1) => {
      uniquePairMap.set(entry1, new Set());
      entries.forEach((entry2) => {
        if (!uniquePairMap.get(entry2)?.has(entry1)) {
          uniquePairMap.get(entry1)!.add(entry2);
        }
      });
    });

    const pairs: [T, T][] = [];
    uniquePairMap.forEach((entries, entry1) => {
      entries.forEach((entry2) => pairs.push([entry1, entry2]));
    });
    return pairs;
  }
}
