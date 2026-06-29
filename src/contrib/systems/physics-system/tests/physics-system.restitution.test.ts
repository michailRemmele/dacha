import { RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';

import {
  createBoxActor,
  createCircleActor,
  createPhysicsSystem,
  createScene,
} from './helpers';

describe('Systems -> PhysicsSystem -> restitution', () => {
  it('Preserves frictionless bouncy circle apex height against a box floor', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, undefined, 600);
    const floor = createBoxActor('floor', 'static', 16, 40);
    floor.getComponent(RigidBody).restitution = 1;
    floor.getComponent(RigidBody).friction = 0;
    floor.getComponent(Transform).world.scale.x = 320;
    floor.getComponent(Transform).world.scale.y = 8;
    const body = createCircleActor('body', -8, -56, 8);
    body.setComponent(
      new RigidBody({
        type: 'dynamic',
        mass: 1,
        gravityScale: 1,
        linearDamping: 0,
        restitution: 1,
        friction: 0,
        disabled: false,
        oneWay: false,
      }),
    );
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    scene.appendChild(floor);
    scene.appendChild(body);

    const apexes: number[] = [];
    let previousVelocityY = rigidBody.linearVelocity.y;
    let minY = transform.world.position.y;

    for (let step = 0; step < 500; step += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 20 });

      if (rigidBody.linearVelocity.y < 0) {
        minY = Math.min(minY, transform.world.position.y);
      }

      if (previousVelocityY < 0 && rigidBody.linearVelocity.y >= 0) {
        apexes.push(minY);
        minY = transform.world.position.y;
      }

      previousVelocityY = rigidBody.linearVelocity.y;
    }

    expect(apexes.length).toBeGreaterThanOrEqual(5);
    expect(Math.abs(apexes[4] - apexes[1])).toBeLessThan(0.5);
  });

  it('Does not gain bounce height on a frictionless angled bouncy contact', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, undefined, 600);
    const slope = createBoxActor('slope', 'static', 0, 48);
    slope.getComponent(RigidBody).restitution = 1;
    slope.getComponent(RigidBody).friction = 0;
    slope.getComponent(Transform).world.scale.x = 2000;
    slope.getComponent(Transform).world.scale.y = 8;
    slope.getComponent(Transform).world.rotation = -Math.PI / 12;
    const body = createCircleActor('body', -48, -56, 8);
    body.setComponent(
      new RigidBody({
        type: 'dynamic',
        mass: 1,
        gravityScale: 1,
        linearDamping: 0,
        restitution: 1,
        friction: 0,
        disabled: false,
        oneWay: false,
      }),
    );
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    scene.appendChild(slope);
    scene.appendChild(body);

    const apexes: number[] = [];
    let previousVelocityY = rigidBody.linearVelocity.y;
    let minY = transform.world.position.y;

    for (let step = 0; step < 600; step += 1) {
      physicsSystem.fixedUpdate({ deltaTime: 20 });

      if (rigidBody.linearVelocity.y < 0) {
        minY = Math.min(minY, transform.world.position.y);
      }

      if (previousVelocityY < 0 && rigidBody.linearVelocity.y >= 0) {
        apexes.push(minY);
        minY = transform.world.position.y;
      }

      previousVelocityY = rigidBody.linearVelocity.y;
    }

    expect(apexes.length).toBeGreaterThanOrEqual(2);

    const baselineApex = apexes[0];
    const highestLaterApex = Math.min(...apexes.slice(1));

    expect(highestLaterApex).toBeGreaterThanOrEqual(baselineApex - 2);
  });
});
