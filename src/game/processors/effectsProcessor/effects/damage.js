import Effect from './effect';

const DAMAGE_MSG = 'DAMAGE';

class Damage extends Effect {
  constructor(gameObject, messageBus, options) {
    super();

    this._gameObject = gameObject;
    this._messageBus = messageBus;
    this._value = options.value;
  }

  apply() {
    this._messageBus.send({
      type: DAMAGE_MSG,
      id: this._gameObject.getId(),
      gameObject: this._gameObject,
      value: this._value,
    });
  }
}

export default Damage;
