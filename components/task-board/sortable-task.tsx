"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FilePenLineIcon } from "@/components/ui/file-pen-line"
import { Task } from "../../lib/types/types"

export function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-3 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-medium">{task.title}</h4>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>
        <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8">
          <FilePenLineIcon size={16} />
        </Button>
      </div>
    </Card>
  )
}
