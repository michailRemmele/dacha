export interface ColorReader {
  read(color: string): Record<string, number>;
}
