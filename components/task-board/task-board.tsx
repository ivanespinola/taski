"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core"

import { Column } from "./column"
import { DraggingTask } from "./dragging-task"
import { initialColumns } from "../../app/data"
import { Task } from "../../lib/types/types"

export function TaskBoard() {
  const [mounted, setMounted] = React.useState(false)
  const [columns, setColumns] = React.useState(initialColumns)
  const [activeTask, setActiveTask] = React.useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {})
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const activeTask = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === active.id)

    const overColumn = columns.find((col) => col.id === over.id)

    if (!activeTask || !overColumn) return

    setColumns((columns) => {
      // Remove task from current column
      const newColumns = columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== activeTask.id),
      }))

      // Add task to new column
      const targetColumn = newColumns.find((col) => col.id === overColumn.id)
      if (targetColumn) {
        targetColumn.tasks.push({
          ...activeTask,
          status: overColumn.id as Task["status"],
        })
      }

      return newColumns
    })
    setActiveTask(null)
  }

  if (!mounted) {
    return null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <DraggingTask task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
