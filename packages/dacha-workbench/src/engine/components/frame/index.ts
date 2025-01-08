import { Component } from 'dacha'

export class Frame extends Component {
  selectedActorId?: string

  clone(): Frame {
    return new Frame()
  }
}

Frame.componentName = 'Frame'
