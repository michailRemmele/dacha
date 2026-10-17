let context: OfflineAudioContext | undefined;

export const decodeAudio = (buffer: ArrayBuffer): Promise<AudioBuffer> => {
  context ??= new OfflineAudioContext(1, 1, 44100);
  return context.decodeAudioData(buffer);
};
