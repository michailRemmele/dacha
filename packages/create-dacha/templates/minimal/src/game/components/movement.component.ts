import { Component, DefineComponent, DefineField } from 'dacha';

@DefineComponent({
  name: 'Movement',
})
export default class Movement extends Component {
  @DefineField({ initialValue: 120 })
  speed!: number;

  directionX = 0;
  directionY = 0;

  isMoving = false;
}
