class AudioLoader {
  private cache: Map<string, ArrayBuffer>;

  constructor() {
    this.cache = new Map();
  }

  async load(url: string): Promise<ArrayBuffer> {
    if (this.cache.has(url)) {
      return structuredClone(this.cache.get(url) as ArrayBuffer);
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    this.cache.set(url, arrayBuffer);

    return structuredClone(arrayBuffer);
  }
}

export const audioLoader = new AudioLoader();
