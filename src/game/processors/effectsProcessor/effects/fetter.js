import Effect from './effect';

const MOVEMENT_COMPONENT_NAME = 'movement';

class Fetter extends Effect {
  constructor(gameObject) {
    super();

    this._gameObject = gameObject;
  }

  apply() {
    const movement = this._gameObject.getComponent(MOVEMENT_COMPONENT_NAME);

    if (!movement) {
      return;
    }

    movement.penalty += movement.speed;
  }

  onCancel() {
    const movement = this._gameObject.getComponent(MOVEMENT_COMPONENT_NAME);

    if (!movement) {
      return;
    }

    movement.penalty -= movement.speed;
  }
}

export default Fetter;
