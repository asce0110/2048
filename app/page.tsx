"use client"

import { useState, useEffect, useRef } from "react"
import GameBoard from "@/components/game-board"
import HistoryPanel from "@/components/history-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { initialGameState, type GameState, type GameHistory, addRandomTile } from "@/lib/game-types"
import { moveGrid, isGameOver, hasWon } from "@/lib/game-logic"
import { Volume2, VolumeX } from "lucide-react"

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({ 
    grid: Array(4).fill(0).map(() => Array(4).fill(0)), 
    score: 0 
  })
  const [history, setHistory] = useState<GameHistory[]>([])
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null)
  const [moveCount, setMoveCount] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      startNewGame()
    }
  }, [isClient])

  // Initialize game
  useEffect(() => {
    // Create audio context on first user interaction
    const handleFirstInteraction = () => {
      if (!audioContextRef.current) {
        try {
          // Create audio context
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext
          if (AudioContext) {
            audioContextRef.current = new AudioContext()
            setSoundEnabled(true)
          }
        } catch (error) {
          console.error("Failed to create audio context:", error)
        }
      }

      // Remove event listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    // Add event listeners for first interaction
    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("keydown", handleFirstInteraction)

    return () => {
      // Clean up event listeners
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)

      // Close audio context if it exists
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Function to play a simple beep sound using the Web Audio API
  const playBeepSound = () => {
    if (!soundEnabled || !audioContextRef.current) return

    try {
      const context = audioContextRef.current

      // Create an oscillator (simple tone generator)
      const oscillator = context.createOscillator()
      oscillator.type = "sine" // Sine wave - smooth sound
      oscillator.frequency.setValueAtTime(440, context.currentTime) // 440 Hz - A4 note

      // Create a gain node to control volume
      const gainNode = context.createGain()
      gainNode.gain.setValueAtTime(0.1, context.currentTime) // Set volume to 10%

      // Connect oscillator to gain node and gain node to output
      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      // Start and stop the oscillator to create a short beep
      oscillator.start(context.currentTime)
      oscillator.stop(context.currentTime + 0.1) // 100ms beep
    } catch (error) {
      console.error("Error playing beep sound:", error)
    }
  }

  // Toggle sound on/off
  const toggleSound = () => {
    if (!soundEnabled && !audioContextRef.current) {
      try {
        // Create audio context if it doesn't exist
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContext) {
          audioContextRef.current = new AudioContext()
          setSoundEnabled(true)
        }
      } catch (error) {
        console.error("Failed to create audio context:", error)
      }
    } else {
      setSoundEnabled(!soundEnabled)
    }
  }

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || gameWon) return

      let direction = ""
      switch (e.key) {
        case "ArrowUp":
          direction = "up"
          break
        case "ArrowDown":
          direction = "down"
          break
        case "ArrowLeft":
          direction = "left"
          break
        case "ArrowRight":
          direction = "right"
          break
        default:
          return
      }

      const { newGrid, moved, score } = moveGrid(gameState.grid, direction)

      if (moved) {
        // Play sound if enabled
        playBeepSound()

        setGameState((prev) => ({
          grid: newGrid,
          score: prev.score + score,
        }))

        setMoveCount((prev) => prev + 1)

        // Check for win/loss
        if (hasWon(newGrid)) {
          setGameWon(true)
          saveGameToHistory(newGrid)
        } else if (isGameOver(newGrid)) {
          setGameOver(true)
          saveGameToHistory(newGrid)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState, gameOver, gameWon, soundEnabled])

  const startNewGame = () => {
    const newGrid = Array(4).fill(0).map(() => Array(4).fill(0))
    
    // 仅在客户端添加随机方块
    if (typeof window !== 'undefined') {
      // 添加两个初始方块
      addRandomTile(newGrid)
      addRandomTile(newGrid)
    }
    
    setGameState({
      grid: newGrid,
      score: 0
    })
    setGameStartTime(new Date())
    setMoveCount(0)
    setGameOver(false)
    setGameWon(false)
  }

  const saveGameToHistory = (finalGrid: number[][]) => {
    if (!gameStartTime) return

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - gameStartTime.getTime()) / 1000)

    const historyEntry: GameHistory = {
      id: history.length + 1,
      startTime: gameStartTime.toISOString(),
      endTime: endTime.toISOString(),
      highestScore: gameState.score,
      duration,
      moveCount,
      finalGrid: JSON.stringify(finalGrid),
      won: gameWon,
    }

    setHistory((prev) => [historyEntry, ...prev])
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">2048</h1>
          <p className="text-gray-600">Join the tiles, get to 2048!</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="bg-gray-200 rounded-md p-3">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-2xl font-bold">{gameState.score}</div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSound}
              title={soundEnabled ? "音效已开启" : "音效已关闭"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button onClick={startNewGame}>New Game</Button>
          </div>
        </div>

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="game">Game</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="game" className="mt-4">
            <GameBoard grid={gameState.grid} gameOver={gameOver} gameWon={gameWon} onNewGame={startNewGame} />
            <div className="mt-4 text-sm text-gray-600">
              <p>Use arrow keys to move tiles. When two tiles with the same number touch, they merge into one!</p>
              <p className="mt-2">Moves: {moveCount}</p>
              {!soundEnabled && (
                <p className="mt-2 text-amber-600">
                  点击右上角的音量按钮开启音效 (Click the volume button to enable sound)
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <HistoryPanel history={history} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

