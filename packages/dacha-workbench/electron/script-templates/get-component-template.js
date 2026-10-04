const getComponentTemplate = (
  name,
) => `import { Component, DefineComponent, DefineField } from 'dacha';

@DefineComponent({
  name: '${name}',
})
export default class ${name} extends Component {
  @DefineField({ initialValue: '' })
  exampleField!: string;
}
`;

module.exports = getComponentTemplate;
