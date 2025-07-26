export interface Loader {
  getSupportedExtensions(): string[]
  load(resourceUrl: string): Promise<unknown>
}
