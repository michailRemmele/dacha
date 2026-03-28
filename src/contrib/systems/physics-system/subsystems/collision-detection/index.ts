import { ActorQuery } from '../../../../../engine/actor';
import type { SceneSystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import { Transform, Collider, RigidBody } from '../../../../components';
import { AddActor, RemoveActor } from '../../../../../engine/events';
import type {
  AddActorEvent,
  RemoveActorEvent,
} from '../../../../../engine/events';
import { insertionSort } from '../../../../../engine/data-lib';

import { geometryBuilders } from './geometry-builders';
import { aabbBuilders } from './aabb-builders';
import { intersectionCheckers } from './intersection-checkers';
import { DispersionCalculator } from './dispersion-calculator';
import { checkTransform, checkCollider } from './reorientation-checkers';
import type { PhysicsSettings } from '../../types';
import type {
  SortedItem,
  Proxy,
  Axis,
  Axes,
  ProxyPair,
  Contact,
  Intersection,
  OrientationData,
} from './types';

export class CollisionDetectionSubsystem {
  private actorQuery: ActorQuery;
  private axis: Axes;
  private proxiesByActorId: Map<string, Proxy>;
  private proxyPairs: ProxyPair[];
  private contacts: Contact[];
  private actorIdsToDelete: Set<string>;
  private collisionMatrix: PhysicsSettings['collisionMatrix'];

  constructor(options: SceneSystemOptions) {
    const settings = options.globalOptions.physics as
      | PhysicsSettings
      | undefined;

    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [Collider, Transform],
    });

    this.axis = {
      x: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator('x'),
      },
      y: {
        sortedList: [],
        dispersionCalculator: new DispersionCalculator('y'),
      },
    };
    this.proxiesByActorId = new Map();
    this.proxyPairs = [];
    this.contacts = [];
    this.actorIdsToDelete = new Set();
    this.collisionMatrix = settings?.collisionMatrix ?? {};

    this.actorQuery.getActors().forEach((actor) => this.addProxy(actor));

    this.actorQuery.addEventListener(AddActor, this.handleActorAdd);
    this.actorQuery.addEventListener(RemoveActor, this.handleActorRemove);
  }

  destroy(): void {
    this.actorQuery.removeEventListener(AddActor, this.handleActorAdd);
    this.actorQuery.removeEventListener(RemoveActor, this.handleActorRemove);
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    this.addProxy(event.actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    this.actorIdsToDelete.add(event.actor.id);
  };

  private checkOnReorientation(actor: Actor): boolean {
    const proxy = this.proxiesByActorId.get(actor.id);

    if (!proxy) {
      return true;
    }

    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const transformOld = proxy.orientationData.transform;
    const colliderOld = proxy.orientationData.collider;

    return (
      checkTransform(transform, transformOld) ||
      checkCollider(collider, colliderOld)
    );
  }

  private getOrientationData(actor: Actor): OrientationData {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    return {
      transform: {
        positionX: transform.world.position.x,
        positionY: transform.world.position.y,
        rotation: transform.world.rotation,
        scaleX: transform.world.scale.x,
        scaleY: transform.world.scale.y,
      },
      collider: {
        type: collider.type,
        centerX: collider.centerX,
        centerY: collider.centerY,
        sizeX: collider.sizeX,
        sizeY: collider.sizeY,
        radius: collider.radius,
        layer: collider.layer,
      },
    };
  }

  private addProxy(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.type](collider, transform);
    const aabb = aabbBuilders[collider.type](geometry);

    const proxy = {
      actor,
      aabb,
      geometry,
      orientationData: this.getOrientationData(actor),
    } as Proxy;

    this.axis.x.dispersionCalculator.addToSample(aabb);
    this.addToSortedList(proxy, 'x');

    this.axis.y.dispersionCalculator.addToSample(aabb);
    this.addToSortedList(proxy, 'y');

    this.proxiesByActorId.set(actor.id, proxy);
  }

  private updateProxy(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const collider = actor.getComponent(Collider);

    const geometry = geometryBuilders[collider.type](collider, transform);
    const aabb = aabbBuilders[collider.type](geometry);

    const proxy = this.proxiesByActorId.get(actor.id)!;
    const prevAABB = proxy.aabb;

    proxy.aabb = aabb;
    proxy.geometry = geometry;
    proxy.orientationData = this.getOrientationData(actor);

    this.axis.x.dispersionCalculator.removeFromSample(prevAABB);
    this.axis.x.dispersionCalculator.addToSample(aabb);
    this.updateSortedList(proxy, 'x');

    this.axis.y.dispersionCalculator.removeFromSample(prevAABB);
    this.axis.y.dispersionCalculator.addToSample(aabb);
    this.updateSortedList(proxy, 'y');
  }

  private addToSortedList(proxy: Proxy, axis: Axis): void {
    const min = { value: proxy.aabb.min[axis], proxy };
    const max = { value: proxy.aabb.max[axis], proxy };

    this.axis[axis].sortedList.push(min, max);

    proxy.edges ??= {} as Record<Axis, [SortedItem, SortedItem]>;
    proxy.edges[axis] = [min, max];
  }

  private updateSortedList(proxy: Proxy, axis: Axis): void {
    const [min, max] = proxy.edges[axis];

    min.value = proxy.aabb.min[axis];
    min.proxy = proxy;

    max.value = proxy.aabb.max[axis];
    max.proxy = proxy;
  }

  private clearSortedList(axis: Axis): void {
    this.axis[axis].sortedList = this.axis[axis].sortedList.filter(
      (item) => !this.actorIdsToDelete.has(item.proxy.actor.id),
    );
  }

  private getAxes(): Axis[] {
    const xDispersion = this.axis.x.dispersionCalculator.getDispersion();
    const yDispersion = this.axis.y.dispersionCalculator.getDispersion();

    return xDispersion >= yDispersion ? ['x', 'y'] : ['y', 'x'];
  }

  private areStaticBodies(proxy1: Proxy, proxy2: Proxy): boolean {
    const { actor: actor1 } = proxy1;
    const { actor: actor2 } = proxy2;

    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    return rigidBody1?.type === 'static' && rigidBody2?.type === 'static';
  }

  private testAABB(proxy1: Proxy, proxy2: Proxy, axis: Axis): boolean {
    const aabb1 = proxy1.aabb;
    const aabb2 = proxy2.aabb;

    return (
      aabb1.max[axis] > aabb2.min[axis] && aabb1.min[axis] < aabb2.max[axis]
    );
  }

  private testCollisionLayers(proxy1: Proxy, proxy2: Proxy): boolean {
    const collider1 = proxy1.actor.getComponent(Collider);
    const collider2 = proxy2.actor.getComponent(Collider);

    return this.collisionMatrix[collider1.layer]?.[collider2.layer] ?? true;
  }

  private sweepAndPrune(): void {
    const [mainAxis, secondAxis] = this.getAxes();

    const { sortedList } = this.axis[mainAxis];

    insertionSort(sortedList, (arg1, arg2) => arg1.value - arg2.value);

    const activeProxies = new Set<Proxy>();

    let proxyPairIndex = 0;
    for (const item of sortedList) {
      const { proxy } = item;

      if (!activeProxies.has(proxy)) {
        activeProxies.forEach((activeProxy) => {
          if (!this.testAABB(proxy, activeProxy, secondAxis)) {
            return;
          }

          if (this.areStaticBodies(proxy, activeProxy)) {
            return;
          }

          if (!this.testCollisionLayers(proxy, activeProxy)) {
            return;
          }

          this.proxyPairs[proxyPairIndex] = [proxy, activeProxy];
          proxyPairIndex += 1;
        });
        activeProxies.add(proxy);
      } else {
        activeProxies.delete(proxy);
      }
    }

    if (this.proxyPairs.length > proxyPairIndex) {
      this.proxyPairs.length = proxyPairIndex;
    }
  }

  private checkOnIntersection(proxyPair: ProxyPair): Intersection | false {
    const [proxy1, proxy2] = proxyPair;

    const type1 = proxy1.actor.getComponent(Collider).type;
    const type2 = proxy2.actor.getComponent(Collider).type;

    return intersectionCheckers[type1][type2](proxy1, proxy2);
  }

  private storeContact(
    contactIndex: number,
    actor1: Actor,
    actor2: Actor,
    intersection: Intersection,
  ): void {
    this.contacts[contactIndex] ??= {
      actor1,
      actor2,
      normal: intersection.normal,
      penetration: intersection.penetration,
      contactPoints: intersection.contactPoints,
    };

    this.contacts[contactIndex].actor1 = actor1;
    this.contacts[contactIndex].actor2 = actor2;
    this.contacts[contactIndex].normal = intersection.normal;
    this.contacts[contactIndex].penetration = intersection.penetration;
    this.contacts[contactIndex].contactPoints = intersection.contactPoints;
  }

  private clearDeletedProxies(): void {
    if (this.actorIdsToDelete.size === 0) {
      return;
    }

    this.clearSortedList('x');
    this.clearSortedList('y');

    this.actorIdsToDelete.forEach((id) => {
      const proxy = this.proxiesByActorId.get(id)!;

      this.axis.x.dispersionCalculator.removeFromSample(proxy.aabb);
      this.axis.y.dispersionCalculator.removeFromSample(proxy.aabb);

      this.proxiesByActorId.delete(id);
    });

    this.actorIdsToDelete.clear();
  }

  update(): Contact[] {
    this.clearDeletedProxies();

    this.actorQuery.getActors().forEach((actor) => {
      if (!this.checkOnReorientation(actor)) {
        return;
      }

      this.updateProxy(actor);
    });

    this.sweepAndPrune();

    let contactIndex = 0;
    this.proxyPairs.forEach((proxyPair) => {
      const intersection = this.checkOnIntersection(proxyPair);
      if (intersection) {
        this.storeContact(
          contactIndex,
          proxyPair[0].actor,
          proxyPair[1].actor,
          intersection,
        );
        contactIndex += 1;
      }
    });

    if (this.contacts.length > contactIndex) {
      this.contacts.length = contactIndex;
    }

    return this.contacts;
  }
}
