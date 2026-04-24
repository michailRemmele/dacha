import { Component } from 'dacha';

export class Technical extends Component {
  clone(): Technical {
    return new Technical();
  }
}

Technical.componentName = 'Technical';
