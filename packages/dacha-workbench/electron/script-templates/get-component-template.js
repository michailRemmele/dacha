const getComponentTemplate = (
  name,
) => `import { Component, DefineComponent, DefineField } from 'dacha';

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
}
`;

module.exports = getComponentTemplate;
