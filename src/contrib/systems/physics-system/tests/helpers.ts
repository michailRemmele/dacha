import { ActorCreator, ActorSpawner, Actor } from '../../../../engine/actor';
import { Scene } from '../../../../engine/scene';
import { TemplateCollection } from '../../../../engine/template';
import { World } from '../../../../engine/world';
import { Collider, RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';
import { PhysicsSystem } from '../index';
import type { PhysicsSettings } from '../types';

export const createScene = (): Scene => {
  const templateCollection = new TemplateCollection();
  const actorCreator = new ActorCreator([], templateCollection);

  return new Scene({
    id: 'scene',
    name: 'scene',
    actors: [],
    actorCreator,
    templateCollection,
  });
};

export const createPhysicsSystem = (
  scene: Scene,
  settings?: PhysicsSettings,
  gravityY = 0,
  gravityX = 0,
): { physicsSystem: PhysicsSystem; world: World } => {
  const world = new World({ id: 'world', name: 'world' });
  const templateCollection = new TemplateCollection();
  const actorCreator = new ActorCreator([], templateCollection);

  world.appendChild(scene);

  const physicsSystem = new PhysicsSystem({
    scene,
    world,
    gravityX,
    gravityY,
    actorSpawner: new ActorSpawner(actorCreator),
    globalOptions: settings ? { physics: settings } : {},
    templateCollection,
  });

  physicsSystem.onSceneEnter?.();

  return { physicsSystem, world };
};

export const createBoxActor = (
  id: string,
  type: 'dynamic' | 'static' | 'kinematic',
  positionX: number,
  positionY: number,
  colliderConfig: {
    layer: string;
    oneWay?: boolean;
    oneWayNormalX?: number;
    oneWayNormalY?: number;
  } = { layer: 'default', oneWay: false },
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.world.position.x = positionX;
  transform.world.position.y = positionY;
  actor.setComponent(
    new Collider({
      type: 'box',
      offsetX: 0,
      offsetY: 0,
      sizeX: 2,
      sizeY: 2,
      layer: colliderConfig.layer,
      disabled: false,
    }),
  );
  actor.setComponent(
    new RigidBody({
      type,
      mass: 1,
      gravityScale: 0,
      linearDamping: 0,
      disabled: false,
      oneWay: colliderConfig.oneWay ?? false,
      oneWayNormalX: colliderConfig.oneWayNormalX,
      oneWayNormalY: colliderConfig.oneWayNormalY,
    }),
  );

  return actor;
};

export const createCircleActor = (
  id: string,
  positionX: number,
  positionY: number,
  radius: number,
  colliderConfig: Pick<Collider, 'layer'> = { layer: 'default' },
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.world.position.x = positionX;
  transform.world.position.y = positionY;
  actor.setComponent(
    new Collider({
      type: 'circle',
      offsetX: 0,
      offsetY: 0,
      radius,
      layer: colliderConfig.layer,
      disabled: false,
    }),
  );

  return actor;
};

export const createSegmentActor = (
  id: string,
  positionX: number,
  positionY: number,
  point1X: number,
  point1Y: number,
  point2X: number,
  point2Y: number,
  type?: 'dynamic' | 'static' | 'kinematic',
  colliderConfig: Pick<Collider, 'layer'> = { layer: 'default' },
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.world.position.x = positionX;
  transform.world.position.y = positionY;
  actor.setComponent(
    new Collider({
      type: 'segment',
      offsetX: 0,
      offsetY: 0,
      point1X,
      point1Y,
      point2X,
      point2Y,
      layer: colliderConfig.layer,
      disabled: false,
    }),
  );

  if (type) {
    actor.setComponent(
      new RigidBody({
        type,
        mass: 1,
        gravityScale: 0,
        linearDamping: 0,
        disabled: false,
        oneWay: false,
      }),
    );
  }

  return actor;
};

export const createCapsuleActor = (
  id: string,
  positionX: number,
  positionY: number,
  height: number,
  radius: number,
  type?: 'dynamic' | 'static' | 'kinematic',
  colliderConfig: Pick<Collider, 'layer'> = { layer: 'default' },
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.world.position.x = positionX;
  transform.world.position.y = positionY;
  actor.setComponent(
    new Collider({
      type: 'capsule',
      offsetX: 0,
      offsetY: 0,
      height,
      radius,
      layer: colliderConfig.layer,
      disabled: false,
    }),
  );

  if (type) {
    actor.setComponent(
      new RigidBody({
        type,
        mass: 1,
        gravityScale: 0,
        linearDamping: 0,
        disabled: false,
        oneWay: false,
      }),
    );
  }

  return actor;
};
