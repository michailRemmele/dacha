import { Component, DefineComponent, DefineField } from 'dacha';

@DefineComponent({ name: 'Spawner' })
export default class Spawner extends Component {
  @DefineField({ type: 'template' })
  prefab!: string;

  @DefineField({ type: 'scene', multiple: true, sortable: true })
  levels!: string[];
}
