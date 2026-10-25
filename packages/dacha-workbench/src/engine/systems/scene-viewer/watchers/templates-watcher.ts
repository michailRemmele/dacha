import type { TemplateConfig, TemplateCollection } from 'dacha';

import type { CommanderStore } from '../../../../store';
import { includesArray } from '../../../../utils/includes-array';
import { omit } from '../utils';

import type { Watcher } from './types';

interface TemplatesWatcherOptions {
  store: CommanderStore;
  templateCollection: TemplateCollection;
  rebuildActors: () => void;
}

export class TemplatesWatcher implements Watcher {
  private store: CommanderStore;
  private templateCollection: TemplateCollection;
  private rebuildActors: () => void;

  constructor({
    store,
    templateCollection,
    rebuildActors,
  }: TemplatesWatcherOptions) {
    this.store = store;
    this.templateCollection = templateCollection;
    this.rebuildActors = rebuildActors;
  }

  handle(path: string[]): void {
    if (!includesArray(path, ['templates'])) {
      return;
    }

    this.templateCollection
      .getAll(true)
      .forEach((template) => this.templateCollection.delete(template.id));

    const templates = this.store.get(['templates']) as TemplateConfig[];
    templates.forEach((template) =>
      this.templateCollection.register(omit(template)),
    );

    this.rebuildActors();
  }
}
