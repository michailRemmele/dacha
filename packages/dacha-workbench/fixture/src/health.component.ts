import { Component, DefineComponent, DefineField } from 'dacha';

interface HealthConfig {
  points: number;
  regenerates: boolean;
  regenerationRate?: number;
}

@DefineComponent({
  name: 'Health',
  icon: 'Heart',
})
export default class Health extends Component {
  @DefineField({ initialValue: 100 })
  points: number;

  @DefineField({ initialValue: false })
  regenerates: boolean;

  @DefineField({
    initialValue: 5,
    section: 'regeneration',
    dependency: { name: 'regenerates', value: true },
  })
  regenerationRate?: number;

  constructor(config: HealthConfig) {
    super();

    this.points = config.points;
    this.regenerates = config.regenerates;
    this.regenerationRate = config.regenerationRate;
  }
}
