const getComponentTemplate = (name) => `import { Component } from 'dacha';
import { DefineComponent, DefineField } from 'dacha-workbench/decorators';

interface ${name}Config {
  exampleField: string
}

@DefineComponent({
  name: '${name}',
})
export default class ${name} extends Component {
  @DefineField()
  exampleField: string;

  constructor(config: ${name}Config) {
    super();

    const { exampleField } = config;

    this.exampleField = exampleField;
  }

  clone(): ${name} {
    return new ${name}({ exampleField: this.exampleField });
  }
}
`

module.exports = getComponentTemplate
