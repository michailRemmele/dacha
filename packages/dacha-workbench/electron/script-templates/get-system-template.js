const getSystemTemplate = (name) => `import { SceneSystem } from 'dacha';
import type { Scene, SceneSystemOptions } from 'dacha';
import { DefineSystem } from 'dacha-workbench/decorators';

@DefineSystem({
  name: '${name}',
})
export default class ${name} extends SceneSystem {
  private scene: Scene;

  constructor(options: SceneSystemOptions) {
    super();

    const { scene } = options;

    this.scene = scene;
  }

  update(): void {
    console.log(\`Scene Id: \${this.scene.id}, System Name: ${name}\`);
  }
}
`

module.exports = getSystemTemplate
