import { Container, type ViewContainer, type IRenderLayer } from 'pixi.js';

import { Actor } from '../../../engine/actor';
import { type Scene } from '../../../engine/scene';
import { Transform } from '../../components/transform';
import { Sprite } from '../../components/sprite';
import { Shape } from '../../components/shape';
import { PixiView } from '../../components/pixi-view';
import { BitmapText } from '../../components/bitmap-text';
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
import {
  SpriteBuilder,
  ShapeBuilder,
  PixiViewBuilder,
  BitmapTextBuilder,
} from './builders';
import type { Builder } from './builders';
import { floatEquals } from './utils';
import type { ViewComponent } from './types';

interface ActorRenderTreeOptions {
  worldContainer: Container;
  scene: Scene;
  assets: Assets;
  sortingLayers: Map<string, IRenderLayer>;
}

export class ActorRenderTree {
  private scene: Scene;
  private worldContainer: Container;
  private assets: Assets;
  private sortingLayers: Map<string, IRenderLayer>;

  public viewEntries: Set<ViewContainer>;

  private builders: Map<string, Builder>;
  private actorContainerMap: Map<Actor, Container>;
  private actorParentMap: Map<Actor, Actor | Scene | null>;

  constructor({
    scene,
    worldContainer,
    assets,
    sortingLayers,
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

  private updatePosition(container: Container, actor: Actor): void {
    const {
      relativeOffsetX,
      relativeOffsetY,
      relativeRotation,
      relativeScaleX,
      relativeScaleY,
    } = actor.getComponent(Transform);

    const meta = container.__dacha.meta;

    if (relativeRotation !== meta.angle) {
      container.angle = relativeRotation;
      meta.angle = relativeRotation;
    }

    if (
      !floatEquals(relativeOffsetX, meta.offsetX as number) ||
      !floatEquals(relativeOffsetY, meta.offsetY as number)
    ) {
      container.position.set(relativeOffsetX, relativeOffsetY);
      meta.offsetX = relativeOffsetX;
      meta.offsetY = relativeOffsetY;
    }

    if (relativeScaleX !== meta.scaleX || relativeScaleY !== meta.scaleY) {
      container.scale.set(relativeScaleX, relativeScaleY);
      meta.scaleX = relativeScaleX;
      meta.scaleY = relativeScaleY;
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
      if (this.isParentChanged(actor)) {
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

      this.updatePosition(container, actor);
    });

    this.updateViews();
  }
}
