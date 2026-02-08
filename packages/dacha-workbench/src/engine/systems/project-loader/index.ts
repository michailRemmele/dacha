import { WorldSystem, RendererService } from 'dacha';
import type { World, Config, WorldSystemOptions, UpdateOptions } from 'dacha';
import * as Events from 'dacha/events';

import { schemaRegistry } from '../../../decorators/schema-registry';
import { classRegistry } from '../../../decorators/class-registry';
import { widgetRegistry } from '../../../hocs/widget-registry';
import { EventType } from '../../../events';
import { CommanderStore } from '../../../store';
import type { EditorConfig, Extension } from '../../../types/global';

const DEFAULT_AUTO_SAVE_INTERVAL = 10_000;

interface ProjectLoaderResources {
  store: CommanderStore;
}

export class ProjectLoader extends WorldSystem {
  private world: World;
  private editorConfig: EditorConfig;

  private extensionScript?: HTMLScriptElement;

  private autoSaveInterval: number;

  constructor(options: WorldSystemOptions) {
    super();

    this.world = options.world;
    this.editorConfig = window.electron.getEditorConfig();

    this.world.data.configStore = (
      options.resources as ProjectLoaderResources
    ).store;
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

    const rendererService = this.world.getService(RendererService);
    rendererService.reloadShaders(
      classRegistry.getGroup('behavior.shader') ?? [],
    );
  }

  private saveProjectConfig(): void {
    const projectConfig = (this.world.data.configStore as CommanderStore).get(
      [],
    ) as Config;
    window.electron.saveProjectConfig(projectConfig);

    this.world.dispatchEvent(EventType.SaveProject);
  }

  update(options: UpdateOptions): void {
    if (!this.editorConfig.autoSave) {
      return;
    }

    const { deltaTime } = options;

    this.autoSaveInterval -= deltaTime;
    if (this.autoSaveInterval <= 0) {
      this.saveProjectConfig();
      this.autoSaveInterval =
        this.editorConfig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL;
    }
  }
}

ProjectLoader.systemName = 'ProjectLoader';
