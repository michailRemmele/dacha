export interface Loader {
  getSupportedExtensions(): Array<string>
  load(resourceUrl: string): Promise<unknown>
}
