import { Actor } from '../../../../engine/actor';
import { Interpolation } from '../../../components/interpolation';
import { Transform } from '../../../components/transform';
import { RigidBody } from '../../../components/rigid-body';
import { InterpolatorAPI } from '../api';

import {
  createScene,
  createInterpolator,
  createInterpolatedActor,
} from './helpers';

describe('Interpolator', () => {
  it('initializes render values to the transform on the first fixed update', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 10, 20);
    scene.appendChild(actor);

    system.fixedUpdate();
    time._tick(0.016, 0.5);
    system.update();

    const interpolation = actor.getComponent(Interpolation);
    expect(interpolation.renderX).toBe(10);
    expect(interpolation.renderY).toBe(20);
    expect(interpolation.renderRotation).toBe(0);
  });

  it('interpolates between the last two fixed steps using alpha', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0);
    scene.appendChild(actor);

    system.fixedUpdate();

    const transform = actor.getComponent(Transform);
    transform.local.position.x = 10;
    system.fixedUpdate();

    const interpolation = actor.getComponent(Interpolation);

    time._tick(0.016, 0.25);
    system.update();
    expect(interpolation.renderX).toBeCloseTo(2.5);

    time._tick(0.016, 0.75);
    system.update();
    expect(interpolation.renderX).toBeCloseTo(7.5);
  });

  it('shifts snapshots across consecutive fixed steps', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0);
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);

    system.fixedUpdate();
    transform.local.position.x = 10;
    system.fixedUpdate();
    transform.local.position.x = 30;
    system.fixedUpdate();

    time._tick(0.016, 0.5);
    system.update();

    expect(actor.getComponent(Interpolation).renderX).toBeCloseTo(20);
  });

  it('interpolates rotation along the shortest arc', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0);
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);

    transform.local.rotation = 3;
    system.fixedUpdate();
    transform.local.rotation = -3;
    system.fixedUpdate();

    time._tick(0.016, 0.5);
    system.update();

    const expected = 3 + (2 * Math.PI - 6) / 2;
    expect(actor.getComponent(Interpolation).renderRotation).toBeCloseTo(
      expected,
    );
  });

  it('re-initializes with a snap after being re-enabled', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0, { disabled: true });
    scene.appendChild(actor);

    const interpolation = actor.getComponent(Interpolation);
    const transform = actor.getComponent(Transform);

    system.fixedUpdate();
    expect(interpolation._initialized).toBe(false);

    interpolation.disabled = false;
    transform.local.position.x = 50;
    system.fixedUpdate();

    time._tick(0.016, 0.5);
    system.update();

    expect(interpolation.renderX).toBe(50);
  });

  it('snaps immediately when snap() is requested mid-frame', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0);
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);
    const interpolation = actor.getComponent(Interpolation);

    system.fixedUpdate();
    transform.local.position.x = 5;
    system.fixedUpdate();

    // teleport during the update phase (e.g. from a behavior script)
    transform.local.position.x = 100;
    interpolation.snap();

    time._tick(0.016, 0.5);
    system.update();
    expect(interpolation.renderX).toBe(100);

    // the following fixed step must not lerp from stale snapshots
    system.fixedUpdate();
    time._tick(0.016, 0.5);
    system.update();
    expect(interpolation.renderX).toBe(100);
  });

  it('snaps at the next fixed step when snap() is requested before it', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0);
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);
    const interpolation = actor.getComponent(Interpolation);

    system.fixedUpdate();

    transform.local.position.x = 200;
    interpolation.snap();
    system.fixedUpdate();

    time._tick(0.016, 0.5);
    system.update();
    expect(interpolation.renderX).toBe(200);
  });

  it('auto-snaps when one-step movement exceeds snapThreshold', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0, { snapThreshold: 5 });
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);

    system.fixedUpdate();
    transform.local.position.x = 100;
    system.fixedUpdate();

    time._tick(0.016, 0.5);
    system.update();

    expect(actor.getComponent(Interpolation).renderX).toBe(100);
  });

  it('keeps interpolating movement below snapThreshold', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0, { snapThreshold: 5 });
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);

    system.fixedUpdate();
    transform.local.position.x = 3;
    system.fixedUpdate();

    time._tick(0.016, 0.5);
    system.update();

    expect(actor.getComponent(Interpolation).renderX).toBeCloseTo(1.5);
  });

  it('extrapolates ahead of the last fixed step using rigid body velocity', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0, {
      mode: 'extrapolate',
    });
    actor.setComponent(
      new RigidBody({
        type: 'dynamic',
        mass: 1,
        gravityScale: 0,
        linearDamping: 0,
        disabled: false,
        oneWay: false,
      }),
    );
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);
    const rigidBody = actor.getComponent(RigidBody);
    rigidBody.linearVelocity.x = 10;

    system.fixedUpdate();
    transform.local.position.x = 1;
    system.fixedUpdate();

    // fixedDeltaTime is 0.1, alpha 0.5 -> 1 + 10 * 0.05
    time._tick(0.016, 0.5);
    system.update();

    expect(actor.getComponent(Interpolation).renderX).toBeCloseTo(1.5);
  });

  it('falls back to interpolation in extrapolate mode without a rigid body', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0, {
      mode: 'extrapolate',
    });
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);

    system.fixedUpdate();
    transform.local.position.x = 10;
    system.fixedUpdate();

    time._tick(0.016, 0.5);
    system.update();

    expect(actor.getComponent(Interpolation).renderX).toBeCloseTo(5);
  });

  it('does not extrapolate rotation when rotation is locked', () => {
    const scene = createScene();
    const { system, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0, {
      mode: 'extrapolate',
    });
    actor.setComponent(
      new RigidBody({
        type: 'dynamic',
        mass: 1,
        gravityScale: 0,
        linearDamping: 0,
        lockRotation: true,
        disabled: false,
        oneWay: false,
      }),
    );
    scene.appendChild(actor);

    const rigidBody = actor.getComponent(RigidBody);
    rigidBody.angularVelocity = 2;

    const transform = actor.getComponent(Transform);
    transform.local.rotation = 1;
    system.fixedUpdate();
    system.fixedUpdate();

    time._tick(0.016, 0.5);
    system.update();

    expect(actor.getComponent(Interpolation).renderRotation).toBe(1);
  });
});

describe('InterpolatorAPI', () => {
  it('returns interpolated world coordinates for a root actor', () => {
    const scene = createScene();
    const { system, world, time } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0);
    scene.appendChild(actor);

    const transform = actor.getComponent(Transform);

    system.fixedUpdate();
    transform.local.position.x = 10;
    system.fixedUpdate();

    time._tick(0.016, 0.5);

    const api = world.systemApi.get(InterpolatorAPI);
    const result = api.getRenderTransform(actor);

    expect(result.x).toBeCloseTo(5);
    expect(result.y).toBeCloseTo(0);
    expect(result.rotation).toBeCloseTo(0);
  });

  it('falls back to the authoritative transform for non-interpolated actors', () => {
    const scene = createScene();
    const { world, time } = createInterpolator(scene);

    const actor = new Actor({ id: 'plain', name: 'plain' });
    const transform = actor.getComponent(Transform);
    transform.local.position.x = 7;
    transform.local.position.y = 3;
    scene.appendChild(actor);

    time._tick(0.016, 0.5);

    const api = world.systemApi.get(InterpolatorAPI);
    const result = api.getRenderTransform(actor);

    expect(result.x).toBeCloseTo(7);
    expect(result.y).toBeCloseTo(3);
  });

  it('composes a child against its parent render transform', () => {
    const scene = createScene();
    const { system, world, time } = createInterpolator(scene);

    const parent = createInterpolatedActor('parent', 0, 0);
    scene.appendChild(parent);

    const child = new Actor({ id: 'child', name: 'child' });
    child.getComponent(Transform).local.position.x = 5;
    parent.appendChild(child);

    const parentTransform = parent.getComponent(Transform);

    system.fixedUpdate();
    parentTransform.local.position.x = 10;
    system.fixedUpdate();

    time._tick(0.016, 0.5);

    const api = world.systemApi.get(InterpolatorAPI);
    const result = api.getRenderTransform(child);

    // parent renders at 5 (authoritative 10), child offset +5
    expect(result.x).toBeCloseTo(10);
    expect(result.y).toBeCloseTo(0);
  });

  it('snaps an actor through the API', () => {
    const scene = createScene();
    const { world } = createInterpolator(scene);
    const actor = createInterpolatedActor('actor', 0, 0);
    scene.appendChild(actor);

    const api = world.systemApi.get(InterpolatorAPI);
    api.snap(actor);

    expect(actor.getComponent(Interpolation)._snapRequested).toBe(true);
  });
});
