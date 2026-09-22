import { Component } from 'dacha';
import { DefineComponent, DefineField } from 'dacha-workbench/decorators';

interface MovementConfig {
  speed: number;
}

@DefineComponent({
  name: 'Movement',
})
export default class Movement extends Component {
  @DefineField()
  speed: number;

  directionX: number;
  directionY: number;

  isMoving: boolean;

  constructor(config: MovementConfig) {
    super();

    this.speed = config.speed;

    this.directionX = 0;
    this.directionY = 0;

    this.isMoving = false;
  }
}
