"use client"

import { Card } from "@/components/ui/card"
import { Task } from "@/lib/types/types"

interface DraggingTaskProps {
  task: Task
}

export function DraggingTask({ task }: DraggingTaskProps) {
  return (
    <Card className="p-3 shadow-lg">
      <div>
        <h4 className="font-medium">{task.title}</h4>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </div>
    </Card>
  )
}
