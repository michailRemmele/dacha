export type AudioStateNode = {
  sourceNode: AudioBufferSourceNode
  gainNode: GainNode
  properties: {
    volume: number
    group: string
    endedListener: () => void
  }
};

export type AudioGroup = {
  id: string
  name: string
  volume: number
};

export type AudioGroups = {
  groups: AudioGroup[]
};
