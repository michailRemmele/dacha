import type { EntityObserver, EntityObserverFilter } from '../entity';
import type { Store } from '../scene';
import type { MessageBus } from '../message-bus';

import type { System } from './system';

export interface PluginHelperFn {
  <T = unknown>(): Promise<Record<string, T>>
}

export interface SystemPluginOptions {
  createEntityObserver: (filter: EntityObserverFilter) => EntityObserver;
  entitySpawner: unknown,
  entityDestroyer: unknown,
  sceneController: unknown,
  helpers: Record<string, PluginHelperFn>,
  store: Store;
  messageBus: MessageBus;
}

export interface SystemPlugin {
  load(options: SystemPluginOptions): Promise<System> | System;
}
