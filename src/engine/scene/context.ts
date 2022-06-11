export class SceneContext {
  name: string;
  data: Record<string, unknown>;

  constructor(name: string) {
    this.name = name;
    this.data = {};
  }
}
