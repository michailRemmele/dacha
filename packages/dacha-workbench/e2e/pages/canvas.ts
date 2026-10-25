import type { Locator, Page } from '@playwright/test';

type CanvasTool = 'hand' | 'pointer' | 'zoom' | 'template';

/** A point on the canvas as fractions of its width and height. */
export type CanvasPoint = [x: number, y: number];

const CENTER: CanvasPoint = [0.5, 0.5];

/** The scene view and its toolbar. */
export class Canvas {
  readonly root: Locator;

  constructor(private readonly window: Page) {
    this.root = window.locator('#canvas-root');
  }

  async selectTool(tool: CanvasTool): Promise<void> {
    await this.window.getByTestId(`tool-button-${tool}`).click();
  }

  /** Switches the zoom tool to zooming out. */
  async zoomOutMode(): Promise<void> {
    await this.window.getByTestId('zoom-direction-out').click();
  }

  /** Chooses the template the template tool places. */
  async chooseTemplate(name: string): Promise<Locator> {
    const select = this.window.getByTestId('template-tool-select');
    await select.click();
    await this.window.keyboard.type(name);
    await this.window.keyboard.press('Enter');
    return select;
  }

  /** Clicks the canvas `times` times in a row, at its center unless `at` is given. */
  async click({
    at = CENTER,
    times = 1,
  }: { at?: CanvasPoint; times?: number } = {}): Promise<void> {
    const [x, y] = await this.toPage(at);
    for (let i = 0; i < times; i += 1) {
      await this.window.mouse.click(x, y);
    }
  }

  async drag(from: CanvasPoint, to: CanvasPoint, steps = 10): Promise<void> {
    const [fromX, fromY] = await this.toPage(from);
    const [toX, toY] = await this.toPage(to);
    await this.window.mouse.move(fromX, fromY);
    await this.window.mouse.down();
    await this.window.mouse.move(toX, toY, { steps });
    await this.window.mouse.up();
  }

  private async toPage([x, y]: CanvasPoint): Promise<[number, number]> {
    const box = await this.root.boundingBox();
    if (!box) {
      throw new Error('#canvas-root has no bounding box');
    }
    return [box.x + box.width * x, box.y + box.height * y];
  }
}
