import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GameHistory } from "@/lib/game-types"

interface HistoryPanelProps {
  history: GameHistory[]
}

export default function HistoryPanel({ history }: HistoryPanelProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (history.length === 0) {
    return <div className="text-center p-8 text-gray-500">No game history yet. Play a game to see your records!</div>
  }

  return (
    <div className="space-y-4">
      {history.map((game) => (
        <Card key={game.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              <span>{game.won ? "Victory! 🏆" : "Game Over"}</span>
              <span className="text-primary">{game.highestScore} pts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Started:</div>
              <div>{formatDate(game.startTime)}</div>

              <div className="text-gray-500">Duration:</div>
              <div>{formatDuration(game.duration)}</div>

              <div className="text-gray-500">Moves:</div>
              <div>{game.moveCount}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

