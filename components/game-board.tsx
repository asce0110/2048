"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface GameBoardProps {
  grid: number[][]
  gameOver: boolean
  gameWon: boolean
  onNewGame: () => void
}

export default function GameBoard({ grid, gameOver, gameWon, onNewGame }: GameBoardProps) {
  const [animationClass, setAnimationClass] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    setAnimationClass("animate-appear")
    const timer = setTimeout(() => setAnimationClass(""), 200)
    return () => clearTimeout(timer)
  }, [grid, isClient])

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: "bg-gray-200",
      2: "bg-amber-100 text-gray-800",
      4: "bg-amber-200 text-gray-800",
      8: "bg-orange-300 text-white",
      16: "bg-orange-400 text-white",
      32: "bg-orange-500 text-white",
      64: "bg-orange-600 text-white",
      128: "bg-yellow-300 text-white",
      256: "bg-yellow-400 text-white",
      512: "bg-yellow-500 text-white",
      1024: "bg-yellow-600 text-white",
      2048: "bg-yellow-700 text-white",
    }

    return colors[value] || "bg-gray-800 text-white"
  }

  const getFontSize = (value: number) => {
    if (value >= 1000) return "text-xl"
    if (value >= 100) return "text-2xl"
    return "text-3xl"
  }

  return (
    <div className="relative">
      <div className="bg-gray-300 rounded-md p-3">
        <div className="grid grid-cols-4 gap-3">
          {grid.map((row, rowIndex) =>
            row.map((colValue, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "w-16 h-16 flex items-center justify-center rounded-md font-bold transition-all duration-200",
                  getTileColor(isClient ? colValue : 0),
                  getFontSize(colValue),
                  isClient && colValue !== 0 && animationClass,
                )}
              >
                {isClient && colValue !== 0 ? colValue : ""}
              </div>
            )),
          )}
        </div>
      </div>

      {isClient && (gameOver || gameWon) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-2xl font-bold mb-4">{gameWon ? "You Won! 🎉" : "Game Over!"}</h2>
            <Button onClick={onNewGame}>Play Again</Button>
          </div>
        </div>
      )}
    </div>
  )
}

