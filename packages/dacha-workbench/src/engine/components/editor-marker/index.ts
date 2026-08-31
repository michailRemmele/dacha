import { Component } from 'dacha';

export interface EditorMarkerConfig {
  name: string;
  color: string;
}

export class EditorMarker extends Component {
  name: string;
  color: string;

  constructor(config: EditorMarkerConfig) {
    super();

    this.name = config.name;
    this.color = config.color;
  }
}

EditorMarker.componentName = 'EditorMarker';
