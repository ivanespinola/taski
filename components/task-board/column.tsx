"use client"

import { useSortable } from "@dnd-kit/sortable"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SortableTask } from "./sortable-task"
import { Column as ColumnType } from "../../lib/types/types"

export function Column({ column }: { column: ColumnType }) {
  const { setNodeRef } = useSortable({ id: column.id })

  return (
    <div ref={setNodeRef} className="flex-1">
      <Card className="p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{column.title}</h3>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <IconPlus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 min-h-[400px]">
          <SortableContext
            items={column.tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <SortableTask key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </Card>
    </div>
  )
}
