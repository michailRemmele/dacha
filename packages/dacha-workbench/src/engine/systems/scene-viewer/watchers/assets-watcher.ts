import type { Assets, AssetConfig } from 'dacha';

import type { CommanderStore } from '../../../../store';
import { includesArray } from '../../../../utils/includes-array';

import type { Watcher } from './types';

type AssetsLike = Pick<
  Assets,
  'register' | 'unregister' | 'hasKind' | 'acquire'
>;

interface AssetsWatcherOptions {
  store: Pick<CommanderStore, 'get'>;
  assets: AssetsLike;
}

export class AssetsWatcher implements Watcher {
  private store: Pick<CommanderStore, 'get'>;
  private assets: AssetsLike;
  private synced: Map<string, AssetConfig>;

  constructor({ store, assets }: AssetsWatcherOptions) {
    this.store = store;
    this.assets = assets;
    this.synced = new Map();

    this.sync();
  }

  handle(path: string[]): void {
    if (includesArray(path, ['assets'])) {
      this.sync();
    }
  }

  private sync(): void {
    const configs = this.store.get(['assets']) as AssetConfig[];
    const next = new Map<string, AssetConfig>();

    configs.forEach((config) => {
      if (!this.assets.hasKind(config.kind)) {
        return;
      }
      next.set(config.id, config);

      if (this.synced.get(config.id) !== config) {
        this.assets.register(config);
      }
    });

    this.synced.forEach((_config, id) => {
      if (!next.has(id)) {
        this.assets.unregister(id);
      }
    });

    this.synced = next;

    void this.assets.acquire(this, { ids: [...next.keys()] });
  }
}
