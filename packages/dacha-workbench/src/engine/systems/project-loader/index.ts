import { WorldSystem, RendererAPI } from 'dacha';
import type { World, Config, WorldSystemOptions, Time } from 'dacha';
import * as Events from 'dacha/events';

import { widgetRegistry } from '../../../hocs/widget-registry';
import { EventType } from '../../../events';
import { CommanderStore } from '../../../store';
import type { DataValue } from '../../../store/types';
import type { EditorConfig, Extension } from '../../../types/global';
import { globalOptionsSchema } from '../../../view/modules/inspector/widgets';
import { reconcileConfig } from '../../../schema';
import {
  collectSchemas,
  type CollectedSchemas,
  type SchemaEntry,
} from '../../../schema/collect-schemas';
import type { WidgetSchema } from '../../../types/widget-schema';

const DEFAULT_AUTO_SAVE_INTERVAL = 10;

interface ProjectLoaderResources {
  store: CommanderStore;
}

export class ProjectLoader extends WorldSystem {
  private world: World;
  private time: Time;
  private editorConfig: EditorConfig;
  private commanderStore: CommanderStore;

  private extensionScript?: HTMLScriptElement;

  private autoSaveInterval: number;

  constructor(options: WorldSystemOptions) {
    super();

    this.world = options.world;
    this.time = options.time;
    this.editorConfig = window.electron.getEditorConfig();
    this.commanderStore = (options.resources as ProjectLoaderResources).store;

    this.world.data.configStore = this.commanderStore;
    this.world.data.editorConfig = this.editorConfig;

    this.autoSaveInterval =
      this.editorConfig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL;

    window.electron.onSave(() => {
      this.saveProjectConfig();
    });

    window.electron.onNeedsUpdate(() => {
      void this.handleNeedsUpdate();
    });
  }

  private handleNeedsUpdate = async (): Promise<void> => {
    this.extensionScript?.remove();
    this.extensionScript = undefined;

    widgetRegistry.clear();
    window.extension = undefined;

    await this.loadScript('./extension.js');

    this.setUpData({ ...(window.extension as Window['extension'])?.default });

    if (this.reconcileProjectConfig() > 0) {
      this.commanderStore.clear();
    }

    this.world.dispatchEvent(EventType.ExtensionUpdated);
  };

  async onWorldLoad(): Promise<void> {
    await this.loadScript('./extension.js');

    this.setUpData({ ...window.extension?.default });

    this.reconcileProjectConfig();
  }

  private async loadScript(src: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = src;

      script.onload = (): void => resolve();
      script.onerror = (): void => {
        console.warn(`Error while loading bundle: ${src}`);
        resolve();
      };

      document.body.appendChild(script);

      this.extensionScript = script;
    });
  }

  private setUpData(extension: Extension): void {
    const { events = [], locales = {}, modules = [] } = extension;

    this.world.data.extension = {
      events: [...events, ...Object.values(Events)],
      locales,
    };

    const schemas = collectSchemas(modules);
    this.world.data.schemas = schemas;

    const rendererApi = this.world.systemApi.get(RendererAPI);
    rendererApi.reloadShaders(schemas.shaders.map((entry) => entry.class));
  }

  private reconcileProjectConfig(): number {
    const schemas = this.world.data.schemas as CollectedSchemas;
    const toMap = (entries: SchemaEntry[]): Record<string, WidgetSchema> =>
      Object.fromEntries(entries.map((entry) => [entry.name, entry.schema]));

    const fixes = reconcileConfig(this.commanderStore.get([]), {
      components: toMap(schemas.components),
      systems: toMap(schemas.systems),
      globalOptions: globalOptionsSchema,
      scripts: {
        behavior: toMap(schemas.behaviors),
        shader: toMap(schemas.shaders),
        filterEffect: toMap(schemas.filterEffects),
      },
      assets: toMap(schemas.assets),
    });

    fixes.forEach(({ path, value }) => {
      this.commanderStore.assign(path, value as DataValue);
    });

    return fixes.length;
  }

  private saveProjectConfig(): void {
    const projectConfig = this.commanderStore.get([]) as Config;
    window.electron.saveProjectConfig(projectConfig);

    this.world.dispatchEvent(EventType.SaveProject);
  }

  update(): void {
    if (!this.editorConfig.autoSave) {
      return;
    }

    this.autoSaveInterval -= this.time.deltaTime;
    if (this.autoSaveInterval <= 0) {
      this.saveProjectConfig();
      this.autoSaveInterval =
        this.editorConfig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL;
    }
  }
}

ProjectLoader.systemName = 'ProjectLoader';
