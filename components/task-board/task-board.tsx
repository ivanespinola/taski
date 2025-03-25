"use client"

import * as React from "react"
import {
  DndContext,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { useState, useEffect } from "react"
import { Column } from "./column"
import { SortableTask } from "./sortable-task"
import { useTaskStore } from "@/lib/store/store"

export function TaskBoard() {
  const [mounted, setMounted] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const columns = useTaskStore((state) => state.columns)
  const reorderTasks = useTaskStore((state) => state.reorderTasks)
  const moveTask = useTaskStore((state) => state.moveTask)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 0,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 8,
      },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    console.log("Drag start:", event.active.id)
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    console.log("Drag end:", { active: active.id, over: over?.id })

    if (!over) return

    const activeTask = active.data.current as {
      taskId: number
      columnId: string
    }
    const overColumn = over.data.current as { columnId: string }

    console.log("Task data:", { activeTask, overColumn })

    if (!activeTask || !overColumn) return

    // Si la tarea se mueve a una columna diferente
    if (activeTask.columnId !== overColumn.columnId) {
      console.log("Moving task to different column")
      moveTask(activeTask.taskId, activeTask.columnId, overColumn.columnId)
      return
    }

    // Si la tarea se reordena dentro de la misma columna
    const column = columns.find((col) => col.id === activeTask.columnId)
    if (!column) return

    const oldIndex = column.tasks.findIndex(
      (task) => task.id === activeTask.taskId
    )
    const newIndex = column.tasks.findIndex(
      (task) => task.id === Number(over.id)
    )

    if (oldIndex === -1 || newIndex === -1) return

    console.log("Reordering tasks in same column")
    const newTasks = arrayMove(column.tasks, oldIndex, newIndex)
    reorderTasks(
      activeTask.columnId,
      newTasks.map((task) => task.id)
    )
  }

  function handleDragCancel() {
    console.log("Drag cancelled")
    setActiveId(null)
  }

  if (!mounted) {
    return null
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 p-4">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <SortableTask
            id={activeId}
            task={
              columns
                .flatMap((col) => col.tasks)
                .find((task) => task.id === Number(activeId))!
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
