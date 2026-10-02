import { Component, DefineComponent, DefineField } from 'dacha';

interface HealthConfig {
  points: number;
  regenerates: boolean;
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

  constructor(config: HealthConfig) {
    super();

    this.points = config.points;
    this.regenerates = config.regenerates;
  }
}
