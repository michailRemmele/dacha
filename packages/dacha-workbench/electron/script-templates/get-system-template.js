const getSystemTemplate = (
  name,
) => `import { SceneSystem, DefineSystem } from 'dacha';
import type { Scene, SceneSystemOptions } from 'dacha';

@DefineSystem({
  name: '${name}',
})
export default class ${name} extends SceneSystem {
  private scene: Scene;

  constructor(options: SceneSystemOptions) {
    super(options);

    const { scene } = options;

    this.scene = scene;
  }

  update(): void {
    console.log(\`Scene Id: \${this.scene.id}, System Name: ${name}\`);
  }
}
`;

module.exports = getSystemTemplate;
