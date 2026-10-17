import { includesArray } from '../../../../utils/includes-array';

import type { Watcher } from './types';

interface ActorsWatcherOptions {
  rebuildActors: () => void;
}

export class ActorsWatcher implements Watcher {
  private rebuildActors: () => void;

  constructor({ rebuildActors }: ActorsWatcherOptions) {
    this.rebuildActors = rebuildActors;
  }

  handle(path: string[]): void {
    if (includesArray(path, ['scenes'])) {
      this.rebuildActors();
    }
  }
}
