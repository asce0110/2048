import { addRandomTile } from "./game-types"

interface MoveResult {
  newGrid: number[][]
  moved: boolean
  score: number
}

export function moveGrid(grid: number[][], direction: string): MoveResult {
  // Create a deep copy of the grid
  const newGrid = grid.map((row) => [...row])
  let moved = false
  let score = 0

  switch (direction) {
    case "up":
      for (let col = 0; col < 4; col++) {
        const result = moveLine([newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]])
        if (result.moved) {
          moved = true
          score += result.score
          // Update the column with the result
          for (let row = 0; row < 4; row++) {
            newGrid[row][col] = result.line[row]
          }
        }
      }
      break
    case "down":
      for (let col = 0; col < 4; col++) {
        const result = moveLine([newGrid[3][col], newGrid[2][col], newGrid[1][col], newGrid[0][col]])
        if (result.moved) {
          moved = true
          score += result.score
          // Update the column with the result (in reverse)
          for (let row = 0; row < 4; row++) {
            newGrid[3 - row][col] = result.line[row]
          }
        }
      }
      break
    case "left":
      for (let row = 0; row < 4; row++) {
        const result = moveLine(newGrid[row])
        if (result.moved) {
          moved = true
          score += result.score
          newGrid[row] = result.line
        }
      }
      break
    case "right":
      for (let row = 0; row < 4; row++) {
        const result = moveLine([...newGrid[row]].reverse())
        if (result.moved) {
          moved = true
          score += result.score
          newGrid[row] = result.line.reverse()
        }
      }
      break
  }

  // Add a new random tile if the grid changed
  if (moved) {
    addRandomTile(newGrid)
  }

  return { newGrid, moved, score }
}

function moveLine(line: number[]): { line: number[]; moved: boolean; score: number } {
  const originalLine = [...line]
  let score = 0

  // Remove zeros
  const nonZeros = line.filter((cell) => cell !== 0)

  // Merge adjacent same numbers
  const mergedLine: number[] = []
  for (let i = 0; i < nonZeros.length; i++) {
    if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
      mergedLine.push(nonZeros[i] * 2)
      score += nonZeros[i] * 2
      i++ // Skip the next number since we merged it
    } else {
      mergedLine.push(nonZeros[i])
    }
  }

  // Pad with zeros to maintain length
  const result = [...mergedLine, ...Array(4 - mergedLine.length).fill(0)]

  // Check if the line changed
  const moved = !originalLine.every((val, index) => val === result[index])

  return { line: result, moved, score }
}

export function isGameOver(grid: number[][]): boolean {
  // Check if there are any empty cells
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) {
        return false
      }
    }
  }

  // Check if there are any adjacent same numbers (horizontal)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row][col] === grid[row][col + 1]) {
        return false
      }
    }
  }

  // Check if there are any adjacent same numbers (vertical)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === grid[row + 1][col]) {
        return false
      }
    }
  }

  // If we get here, there are no moves left
  return true
}

export function hasWon(grid: number[][]): boolean {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 2048) {
        return true
      }
    }
  }
  return false
}

