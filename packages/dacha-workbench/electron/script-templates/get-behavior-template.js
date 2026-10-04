const getBehaviorTemplate = (
  name,
) => `import type { Scene, BehaviorOptions } from 'dacha';
import { Actor, Behavior, DefineBehavior } from 'dacha';

@DefineBehavior({
  name: '${name}',
})
export default class ${name} extends Behavior {
  private actor: Actor;
  private scene: Scene;

  constructor(options: BehaviorOptions) {
    super(options);

    const { actor, scene } = options;

    this.actor = actor;
    this.scene = scene;
  }

  update(): void {
    console.log(\`Behavior: Actor Id: \${this.actor.id}, Scene Id: \${this.scene.id}\`);
  }
}
`;

module.exports = getBehaviorTemplate;
