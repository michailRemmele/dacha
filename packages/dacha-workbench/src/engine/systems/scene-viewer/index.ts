import { SceneSystem, ActorCreator, TemplateCollection } from 'dacha';
import type {
  World,
  Scene,
  SceneSystemOptions,
  ActorSpawner,
  TemplateConfig,
  SceneConfig,
} from 'dacha';

import { EventType } from '../../../events';
import type { SelectSceneEvent } from '../../../events';
import type { EditorConfig } from '../../../types/global';
import type { CommanderStore } from '../../../store';
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id';

import { ALLOWED_COMPONENTS } from './consts';
import { omit, removeAllChildren } from './utils';
import { AssetsWatcher, ActorsWatcher, TemplatesWatcher } from './watchers';
import type { Watcher } from './watchers';

interface SceneViewerOptions extends SceneSystemOptions {
  mainActorId: string;
}

export class SceneViewer extends SceneSystem {
  world: World;
  editorScene: Scene;
  actorSpawner: ActorSpawner;
  mainActorId: string;
  configStore: CommanderStore;
  editorConfig: EditorConfig;
  actorCreator: ActorCreator;
  templateCollection: TemplateCollection;
  sceneId?: string;
  watchers: Watcher[];
  subscription?: () => void;

  constructor(options: SceneSystemOptions) {
    super();

    const { world, scene, actorSpawner, mainActorId, assets } =
      options as SceneViewerOptions;

    this.world = world;
    this.editorScene = scene;
    this.actorSpawner = actorSpawner;
    this.mainActorId = mainActorId;

    this.configStore = world.data.configStore as CommanderStore;
    this.editorConfig = world.data.editorConfig as EditorConfig;

    const mainActor = scene.findChildById(mainActorId);

    if (!mainActor) {
      throw new Error("Can't find the main actor");
    }

    this.world.data.mainActor = mainActor;

    const templateCollection = new TemplateCollection();
    const templates = this.configStore.get(['templates']) as TemplateConfig[];

    templates.forEach((template) => {
      templateCollection.register(omit(template));
    });

    this.templateCollection = templateCollection;
    this.actorCreator = new ActorCreator(
      ALLOWED_COMPONENTS,
      templateCollection,
    );

    this.world.data.actorCreator = this.actorCreator;

    this.watchers = [
      new AssetsWatcher({ store: this.configStore, assets }),
      new TemplatesWatcher({
        store: this.configStore,
        templateCollection,
        rebuildActors: this.rebuildActors,
      }),
      new ActorsWatcher({ rebuildActors: this.rebuildActors }),
    ];

    const selectedSceneId = getSavedSelectedSceneId(this.configStore);
    if (selectedSceneId) {
      this.showScene(selectedSceneId);
    }
    this.world.addEventListener(EventType.SelectScene, this.handleSelectScene);

    this.subscription = this.configStore.subscribe((path) => {
      this.watchers.forEach((watcher) => watcher.handle(path));
    });
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(
      EventType.SelectScene,
      this.handleSelectScene,
    );
    this.subscription?.();
  }

  private handleSelectScene = (event: SelectSceneEvent): void => {
    if (this.sceneId !== event.sceneId) {
      this.showScene(event.sceneId);
    }
  };

  private showScene(sceneId: string | undefined): void {
    this.sceneId = sceneId;
    this.rebuildActors();
  }

  private rebuildActors = (): void => {
    removeAllChildren(this.editorScene, this.mainActorId);

    const scene = this.sceneId
      ? (this.configStore.get(['scenes', `id:${this.sceneId}`]) as
          SceneConfig | undefined)
      : undefined;

    scene?.actors.forEach((actorConfig) => {
      this.editorScene.appendChild(this.actorCreator.create(omit(actorConfig)));
    });
  };
}

SceneViewer.systemName = 'SceneViewer';
