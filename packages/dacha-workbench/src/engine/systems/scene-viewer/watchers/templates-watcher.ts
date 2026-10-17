import type { TemplateConfig, TemplateCollection } from 'dacha';

import type { CommanderStore } from '../../../../store';
import { includesArray } from '../../../../utils/includes-array';
import { omit } from '../utils';

import type { Watcher } from './types';

const TEMPLATES_PATH_LENGTH = 1;
const TEMPLATE_PATH_LENGTH = 2;

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

    const templatesIdsToDelete = new Set<string>();
    const templatesToAdd = new Map<string, TemplateConfig>();

    if (path.length === TEMPLATES_PATH_LENGTH) {
      const templateConfigs = this.store.get(['templates']) as TemplateConfig[];
      const configIds = new Set(templateConfigs.map((config) => config.id));
      const templateIds = new Set(
        this.templateCollection.getAll(true).map((template) => template.id),
      );

      templateIds.forEach((id) => {
        if (!configIds.has(id)) {
          templatesIdsToDelete.add(id);
        }
      });
      templateConfigs.forEach((config) => {
        if (!templateIds.has(config.id)) {
          templatesToAdd.set(config.id, config);
        }
      });
    }

    if (path.length >= TEMPLATE_PATH_LENGTH) {
      const templatePath = path.slice(0, TEMPLATE_PATH_LENGTH);
      const template = this.store.get(templatePath) as
        TemplateConfig | undefined;

      if (template === undefined) {
        templatesIdsToDelete.add(path[1].split(':')[1]);
      } else {
        templatesIdsToDelete.add(template.id);
        templatesToAdd.set(template.id, template);
      }
    }

    templatesIdsToDelete.forEach((id) => {
      this.templateCollection.delete(id);
    });
    templatesToAdd.forEach((template) => {
      this.templateCollection.register(omit(template));
    });

    this.rebuildActors();
  }
}
