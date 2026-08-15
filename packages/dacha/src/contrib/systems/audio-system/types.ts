export interface AudioStateNode {
  sourceNode: AudioBufferSourceNode;
  gainNode: GainNode;
  properties: {
    volume: number;
    group: string;
    endedListener: () => void;
  };
}

export interface AudioGroup {
  id: string;
  name: string;
  volume: number;
}

export interface AudioGroups {
  groups: AudioGroup[];
}
