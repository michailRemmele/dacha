const getBehaviorTemplate = (name) => `import type { Scene, BehaviorOptions } from 'dacha';
import { Actor, Behavior } from 'dacha';
import { DefineBehavior } from 'dacha-workbench/decorators';

@DefineBehavior({
  name: '${name}',
})
export default class ${name} extends Behavior {
  private actor: Actor;
  private scene: Scene;

  constructor(options: BehaviorOptions) {
    super();

    const { actor, scene } = options;

    this.actor = actor;
    this.scene = scene;
  }

  update(): void {
    console.log(\`Behavior: Actor Id: \${this.actor.id}, Scene Id: \${this.scene.id}\`);
  }
}
`

module.exports = getBehaviorTemplate
