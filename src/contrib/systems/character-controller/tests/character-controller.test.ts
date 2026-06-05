import { Actor, ActorCreator, ActorSpawner } from '../../../../engine/actor';
import { TemplateCollection } from '../../../../engine/template';
import { World } from '../../../../engine/world';
import { Vector2 } from '../../../../engine/math-lib';
import { CharacterBody, Transform } from '../../../components';
import { PhysicsSystem } from '../../physics-system';
import {
  createBoxActor,
  createCapsuleActor,
  createScene,
  createSegmentActor,
} from '../../physics-system/tests/helpers';
import { CharacterController } from '../index';

const createSystems = (): {
  scene: ReturnType<typeof createScene>;
  characterController: CharacterController;
  physicsSystem: PhysicsSystem;
} => {
  const scene = createScene();
  const world = new World({ id: 'world', name: 'world' });
  const templateCollection = new TemplateCollection();
  const actorCreator = new ActorCreator([], templateCollection);
  const systemOptions = {
    scene,
    world,
    gravityX: 0,
    gravityY: 0,
    actorSpawner: new ActorSpawner(actorCreator),
    globalOptions: {},
    templateCollection,
  };

  world.appendChild(scene);

  const characterController = new CharacterController(systemOptions);
  const physicsSystem = new PhysicsSystem(systemOptions);

  physicsSystem.onSceneEnter?.();

  return {
    scene,
    characterController,
    physicsSystem,
  };
};

const addController = (actor: Actor): CharacterBody => {
  actor.setComponent(
    new CharacterBody({
      skinWidth: 0.02,
      groundProbeDistance: 0.2,
    }),
  );

  return actor.getComponent(CharacterBody);
};

describe('Systems -> CharacterController', () => {
  it('Moves a kinematic character through PhysicsSystem movePosition', () => {
    const { scene, characterController, physicsSystem } = createSystems();
    const character = createCapsuleActor(
      'character',
      0,
      0,
      2,
      0.5,
      'kinematic',
    );
    const controller = addController(character);
    const transform = character.getComponent(Transform);

    controller.velocity.x = 10;
    scene.appendChild(character);

    characterController.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(1);
    expect(transform.world.position.y).toBeCloseTo(0);
  });

  it('Consumes one-step controller move displacement once', () => {
    const { scene, characterController, physicsSystem } = createSystems();
    const character = createCapsuleActor(
      'character',
      0,
      0,
      2,
      0.5,
      'kinematic',
    );
    const controller = addController(character);
    const transform = character.getComponent(Transform);

    controller.move(new Vector2(2, 0));
    scene.appendChild(character);

    characterController.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(2);

    characterController.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(2);
  });

  it('Slides along blocking walls and sets side collision state', () => {
    const { scene, characterController, physicsSystem } = createSystems();
    const character = createCapsuleActor(
      'character',
      0,
      0,
      2,
      0.5,
      'kinematic',
    );
    const controller = addController(character);
    const transform = character.getComponent(Transform);
    const wall = createBoxActor('wall', 'static', 3, 0);

    controller.velocity = new Vector2(50, 20);
    scene.appendChild(character);
    scene.appendChild(wall);

    characterController.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(transform.world.position.x).toBeCloseTo(1.48);
    expect(transform.world.position.y).toBeGreaterThan(0);
    expect(controller.onWall).toBe(true);
    expect(controller.velocity.x).toBeCloseTo(0);
  });

  it('Detects ground below a standing character', () => {
    const { scene, characterController, physicsSystem } = createSystems();
    const character = createCapsuleActor(
      'character',
      0,
      -0.55,
      2,
      0.5,
      'kinematic',
    );
    const controller = addController(character);
    const floor = createBoxActor('floor', 'static', 0, 2);

    scene.appendChild(character);
    scene.appendChild(floor);

    characterController.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(controller.onGround).toBe(true);
    expect(controller.groundActor).toBe(floor);
    expect(controller.groundNormal.y).toBeCloseTo(-1);
  });

  it('Sets onCeiling when movement hits a ceiling', () => {
    const { scene, characterController, physicsSystem } = createSystems();
    const character = createCapsuleActor(
      'character',
      0,
      0,
      2,
      0.5,
      'kinematic',
    );
    const controller = addController(character);
    const ceiling = createBoxActor('ceiling', 'static', 0, -3);

    controller.velocity.y = -50;
    scene.appendChild(character);
    scene.appendChild(ceiling);

    characterController.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(controller.onCeiling).toBe(true);
    expect(controller.velocity.y).toBeCloseTo(0);
  });

  it('Treats walkable segment slopes as ground', () => {
    const { scene, characterController, physicsSystem } = createSystems();
    const character = createCapsuleActor(
      'character',
      0,
      -0.65,
      2,
      0.5,
      'kinematic',
    );
    const controller = addController(character);
    const slope = createSegmentActor('slope', 0, 1, 5, -0.5, -5, 0.5, 'static');

    controller.maxSlopeAngle = Math.PI / 3;
    scene.appendChild(character);
    scene.appendChild(slope);

    characterController.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(controller.onGround).toBe(true);
    expect(controller.groundActor).toBe(slope);
    expect(controller.groundNormal.y).toBeLessThan(0);
  });

  it('Uses controller upDirection for ground checks', () => {
    const { scene, characterController, physicsSystem } = createSystems();
    const character = createCapsuleActor(
      'character',
      -0.45,
      0,
      2,
      0.5,
      'kinematic',
    );
    const controller = addController(character);
    const wall = createBoxActor('wall', 'static', -2, 0);

    controller.upDirection = new Vector2(1, 0);
    scene.appendChild(character);
    scene.appendChild(wall);

    characterController.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(controller.onGround).toBe(true);
    expect(controller.groundActor).toBe(wall);
    expect(controller.groundNormal.x).toBeCloseTo(1);
    expect(controller.groundNormal.y).toBeCloseTo(0);
  });
});
