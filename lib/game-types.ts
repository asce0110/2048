export interface GameState {
  grid: number[][]
  score: number
}

export interface GameHistory {
  id: number
  startTime: string
  endTime: string
  highestScore: number
  duration: number
  moveCount: number
  finalGrid: string
  won: boolean
}

export function initialGameState(): GameState {
  // Create empty grid
  const grid = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0))

  // Add two initial tiles
  addRandomTile(grid)
  addRandomTile(grid)

  return { grid, score: 0 }
}

export function addRandomTile(grid: number[][]): void {
  const emptyCells: [number, number][] = []

  // Find all empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push([i, j])
      }
    }
  }

  if (emptyCells.length === 0) return

  // Choose a random empty cell
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]

  // Place a 2 (90% chance) or 4 (10% chance)
  grid[row][col] = Math.random() < 0.9 ? 2 : 4
}

