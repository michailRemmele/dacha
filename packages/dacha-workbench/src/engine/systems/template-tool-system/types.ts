export interface Position {
  x: number | null
  y: number | null
}

export interface ViewComponent {
  material: {
    options: {
      opacity: number
    }
  }
}
