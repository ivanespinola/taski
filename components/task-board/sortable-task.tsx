"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FilePenLineIcon } from "@/components/ui/file-pen-line"
import { Task } from "@/lib/types/types"

interface SortableTaskProps {
  task: Task
  id?: string
}

export function SortableTask({ task, id }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id || task.id.toString(),
    data: {
      taskId: task.id,
      columnId: task.status,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-medium">{task.title}</h4>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <FilePenLineIcon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
