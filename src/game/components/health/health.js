import Component from 'engine/component/component';

class Health extends Component {
  constructor(config) {
    super();

    this._points = config.points;
  }

  set points(points) {
    this._points = points;
  }

  get points() {
    return this._points;
  }

  clone() {
    return new Health({
      points: this.points,
    });
  }
}

export default Health;
