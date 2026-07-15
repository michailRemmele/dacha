import { WorldSystem, RendererAPI } from 'dacha';
import type { World, Config, WorldSystemOptions, Time } from 'dacha';
import * as Events from 'dacha/events';

import { schemaRegistry } from '../../../decorators/schema-registry';
import { classRegistry } from '../../../decorators/class-registry';
import { widgetRegistry } from '../../../hocs/widget-registry';
import { EventType } from '../../../events';
import { CommanderStore } from '../../../store';
import type { DataValue } from '../../../store/types';
import type { EditorConfig, Extension } from '../../../types/global';
import {
  componentsSchema,
  systemsSchema,
  globalOptionsSchema,
} from '../../../view/modules/inspector/widgets';
import { reconcileConfig } from '../../../schema';

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
    schemaRegistry.clear();
    classRegistry.clear();

    await this.loadScript('./extension.js');

    this.setUpData({
      events: window.extension?.default.events,
      locales: window.extension?.default.locales,
    });

    /*
     * comment: Reconciliation writes bypass undo history, which would leave existing history
     * entries able to revert the healing (delete commands capture the parent array by
     * reference). The schemas just changed anyway, so drop history when anything was healed.
     */
    if (this.reconcileProjectConfig() > 0) {
      this.commanderStore.clean();
    }

    this.world.dispatchEvent(EventType.ExtensionUpdated);
  };

  async onWorldLoad(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      await this.loadScript('./extension.js');
    }

    this.setUpData({
      events: window.extension?.default.events,
      locales: window.extension?.default.locales,
    });

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
    const { events = [], locales = {} } = extension;

    this.world.data.extension = {
      events: [...events, ...Object.values(Events)],
      locales,
    };

    const rendererApi = this.world.systemApi.get(RendererAPI);
    rendererApi.reloadShaders(classRegistry.getGroup('behavior.shader') ?? []);
  }

  private reconcileProjectConfig(): number {
    const store = this.world.data.configStore as CommanderStore;

    const fixes = reconcileConfig(store.get([]), {
      components: {
        ...componentsSchema,
        ...schemaRegistry.getGroup('component'),
      },
      systems: { ...systemsSchema, ...schemaRegistry.getGroup('system') },
      globalOptions: globalOptionsSchema,
      behaviors: schemaRegistry.getGroup('behavior') ?? {},
    });

    /* comment: Order matters: coarse parent-path fixes must be applied before nested ones */
    fixes.forEach(({ path, value }) => {
      store.setWithoutHistory(path, value as DataValue);
    });

    return fixes.length;
  }

  private saveProjectConfig(): void {
    const projectConfig = (this.world.data.configStore as CommanderStore).get(
      [],
    ) as Config;
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
