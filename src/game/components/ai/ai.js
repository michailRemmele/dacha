import Component from 'engine/component/component';

class AI extends Component {
  constructor(config) {
    super();

    this._strategy = config.strategy;
  }

  set strategy(strategy) {
    this._strategy = strategy;
  }

  get strategy() {
    return this._strategy;
  }

  clone() {
    return new AI({
      strategy: this.strategy,
    });
  }
}

export default AI;
