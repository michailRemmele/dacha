import { Component, DefineComponent, DefineField } from 'dacha';

import { MARKERS } from '../../../consts/markers';

export interface EditorMarkerConfig {
  name: string;
  color: string;
}

@DefineComponent({ name: 'EditorMarker', icon: 'MapPin' })
export class EditorMarker extends Component {
  @DefineField({ type: 'select', initialValue: 'point', options: MARKERS })
  name: string;
  @DefineField({ type: 'color', initialValue: '#fff' })
  color: string;

  constructor(config: EditorMarkerConfig) {
    super();

    this.name = config.name;
    this.color = config.color;
  }
}
