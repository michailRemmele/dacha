import type { AssetLoadProgress } from '../asset';

/**
 * Counts the steps of a scene load: the media assets of the scene and the
 * `onSceneLoad` of each system. It reports nothing until it knows the number
 * of systems, so the first report already has the full total.
 */
export class LoadProgress {
  private assets: AssetLoadProgress = { total: 0, completed: 0, failed: 0 };
  private systems?: { total: number; completed: number };

  constructor(private report: (progress: AssetLoadProgress) => void) {}

  onAssetsProgress = (progress: AssetLoadProgress): void => {
    this.assets = progress;
    this.emit();
  };

  setSystemsTotal(total: number): void {
    this.systems = { total, completed: 0 };
    this.emit();
  }

  onSystemLoaded(): void {
    this.systems!.completed += 1;
    this.emit();
  }

  private emit(): void {
    if (!this.systems) {
      return;
    }
    this.report({
      total: this.assets.total + this.systems.total,
      completed: this.assets.completed + this.systems.completed,
      failed: this.assets.failed,
    });
  }
}
