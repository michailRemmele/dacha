import { Container, type ViewContainer, type RenderLayer } from 'pixi.js';

import { Actor } from '../../../engine/actor';
import { type Scene } from '../../../engine/scene';
import { Transform } from '../../components/transform';
import { Sprite } from '../../components/sprite';
import { Shape } from '../../components/shape';
import { PixiView } from '../../components/pixi-view';
import { BitmapText } from '../../components/bitmap-text';
import { Mesh } from '../../components/mesh';
import { traverseEntity } from '../../../engine/entity';
import {
  AddComponent,
  RemoveComponent,
  AddChildEntity,
  RemoveChildEntity,
} from '../../../engine/events';
import type {
  AddChildEntityEvent,
  RemoveChildEntityEvent,
  AddComponentEvent,
  RemoveComponentEvent,
} from '../../../engine/events';

import type { Assets } from './assets';
import { MaterialSystem } from './material';
import {
  SpriteBuilder,
  ShapeBuilder,
  PixiViewBuilder,
  BitmapTextBuilder,
  MeshBuilder,
} from './builders';
import type { Builder } from './builders';
import { floatEquals } from './utils';
import type { ViewComponent } from './types';

interface ActorRenderTreeOptions {
  worldContainer: Container;
  scene: Scene;
  assets: Assets;
  sortingLayers: Map<string, RenderLayer>;
  materialSystem: MaterialSystem;
}

export class ActorRenderTree {
  private scene: Scene;
  private worldContainer: Container;
  private assets: Assets;
  private sortingLayers: Map<string, RenderLayer>;

  public viewEntries: Set<ViewContainer>;

  private builders: Map<string, Builder>;
  private actorContainerMap: Map<Actor, Container>;
  private actorParentMap: Map<Actor, Actor | Scene | null>;

  constructor({
    scene,
    worldContainer,
    assets,
    sortingLayers,
    materialSystem,
  }: ActorRenderTreeOptions) {
    this.scene = scene;
    this.worldContainer = worldContainer;
    this.assets = assets;
    this.sortingLayers = sortingLayers;

    this.viewEntries = new Set();

    this.actorContainerMap = new Map();
    this.actorParentMap = new Map();

    this.builders = new Map();
    this.builders.set(Sprite.componentName, new SpriteBuilder({ assets }));
    this.builders.set(Shape.componentName, new ShapeBuilder());
    this.builders.set(PixiView.componentName, new PixiViewBuilder());
    this.builders.set(
      BitmapText.componentName,
      new BitmapTextBuilder({ assets }),
    );
    this.builders.set(
      Mesh.componentName,
      new MeshBuilder({ assets, materialSystem }),
    );

    this.scene.children.forEach((actor) =>
      traverseEntity(actor, (entry) => this.add(entry)),
    );

    this.scene.addEventListener(AddComponent, this.handleAddComponent);
    this.scene.addEventListener(RemoveComponent, this.handleRemoveComponent);
    this.scene.addEventListener(AddChildEntity, this.handleAddChildEntity);
    this.scene.addEventListener(
      RemoveChildEntity,
      this.handleRemoveChildEntity,
    );
  }

  private handleAddComponent = (event: AddComponentEvent): void => {
    const { target, component, name } = event;

    if (!this.builders.has(name)) {
      return;
    }

    void this.assets.load(component);

    const builder = this.builders.get(name)!;
    const container = this.actorContainerMap.get(target)!;

    const view = builder.buildView(component, target);
    this.viewEntries.add(view);
    container.addChild(view);
  };

  private handleRemoveComponent = (event: RemoveComponentEvent): void => {
    if (!this.builders.has(event.name)) {
      return;
    }

    const component = event.component as ViewComponent;

    void this.assets.unload(component);

    if (component?.renderData?.view) {
      this.viewEntries.delete(component.renderData.view);
    }

    if (component) {
      this.builders.get(event.name)?.destroy(component);
    }
  };

  private handleAddChildEntity = (event: AddChildEntityEvent): void => {
    traverseEntity(event.child, (entity) => {
      if (entity instanceof Actor) {
        this.add(entity);
      }
    });
  };

  private handleRemoveChildEntity = (event: RemoveChildEntityEvent): void => {
    traverseEntity(event.child, (entity) => {
      if (entity instanceof Actor) {
        this.delete(entity as Actor);
      }
    });
  };

  destroy(): void {
    this.scene.removeEventListener(AddComponent, this.handleAddComponent);
    this.scene.removeEventListener(RemoveComponent, this.handleRemoveComponent);
    this.scene.removeEventListener(AddChildEntity, this.handleAddChildEntity);
    this.scene.removeEventListener(
      RemoveChildEntity,
      this.handleRemoveChildEntity,
    );

    this.viewEntries.forEach((entry) => {
      this.builders
        .get(entry.__dacha.builderKey)!
        .destroy(entry.__dacha.viewComponent);
    });

    this.actorContainerMap.forEach((container) => container.destroy());

    this.worldContainer.removeChildren();

    this.actorContainerMap.clear();
    this.actorParentMap.clear();
  }

  private add(actor: Actor): Container {
    const container = new Container();
    container.__dacha = {
      meta: {},
    };

    this.actorContainerMap.set(actor, container);

    void this.assets.load(actor);

    this.builders.forEach((builder, componentName) => {
      const viewComponent = actor.getComponent(componentName) as
        | ViewComponent
        | undefined;

      if (viewComponent) {
        const view = builder.buildView(viewComponent, actor);
        this.viewEntries.add(view);
        container.addChild(view);
      }
    });

    this.updateParent(container, actor);
    this.updatePosition(container, actor);

    return container;
  }

  private delete(actor: Actor): void {
    const container = this.actorContainerMap.get(actor);
    container?.removeFromParent();
    container?.destroy();

    this.actorContainerMap.delete(actor);
    this.actorParentMap.delete(actor);

    this.assets.unload(actor);

    this.builders.forEach((builder, componentName) => {
      const viewComponent = actor.getComponent(componentName) as
        | ViewComponent
        | undefined;

      if (viewComponent?.renderData?.view) {
        this.viewEntries.delete(viewComponent.renderData.view);
      }

      if (viewComponent) {
        builder.destroy(viewComponent);
      }
    });
  }

  private isParentChanged(actor: Actor): boolean {
    return (
      !this.actorParentMap.has(actor) ||
      this.actorParentMap.get(actor) !== actor.parent
    );
  }

  private updateParent(container: Container, actor: Actor): void {
    if (!this.isParentChanged(actor)) {
      return;
    }

    container.removeFromParent();

    const nextParent =
      actor.parent instanceof Actor
        ? this.actorContainerMap.get(actor.parent)
        : this.worldContainer;

    if (!nextParent) {
      throw new Error(
        "Failed to add actor: no matching pixi container found for the actor's parent.",
      );
    }

    nextParent.addChild(container);

    this.actorParentMap.set(actor, actor.parent);
  }

  private updatePosition(container: Container, actor: Actor): void {
    const {
      local: { position, rotation, scale },
    } = actor.getComponent(Transform);

    const meta = container.__dacha.meta;

    if (rotation !== meta.rotation) {
      container.rotation = rotation;
      meta.rotation = rotation;
    }

    if (
      !floatEquals(position.x, meta.positionX as number) ||
      !floatEquals(position.y, meta.positionY as number)
    ) {
      container.position.set(position.x, position.y);
      meta.positionX = position.x;
      meta.positionY = position.y;
    }

    if (scale.x !== meta.scaleX || scale.y !== meta.scaleY) {
      container.scale.set(scale.x, scale.y);
      meta.scaleX = scale.x;
      meta.scaleY = scale.y;
    }
  }

  private updateViews(): void {
    this.viewEntries.forEach((view) => {
      this.builders
        .get(view.__dacha.builderKey)!
        .updateView(view.__dacha.viewComponent);

      const meta = view.__dacha.meta;

      const sortingLayer = view.__dacha.viewComponent.sortingLayer;

      if (sortingLayer !== meta.sortingLayer) {
        const renderLayer = this.sortingLayers.get(sortingLayer);
        renderLayer?.attach(view);

        meta.sortingLayer = sortingLayer;
      }
    });
  }

  update(): void {
    this.actorContainerMap.forEach((container, actor) => {
      this.updateParent(container, actor);
      this.updatePosition(container, actor);
    });

    this.updateViews();
  }
}
