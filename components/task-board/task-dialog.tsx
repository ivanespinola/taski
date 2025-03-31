"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTaskStore } from "@/lib/store/store"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Task } from "@/lib/types/types"
import { FilePenLineIcon } from "@/components/ui/file-pen-line"
import { on } from "events"

interface TaskDialogProps {
  columnId?: string
  trigger?: React.ReactNode
  isSidebar?: boolean
  children?: React.ReactNode
  editingTask?: Task
  open?: boolean
  onClose?: () => void
}

export function TaskDialog({
  columnId = "todo",
  trigger,
  children,
  editingTask,
  open,
  onClose,
}: TaskDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open || false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description)
    } else {
      setTitle("")
      setDescription("")
    }
  }, [editingTask])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
      })
    } else {
      addTask(columnId, {
        title: title.trim(),
        description: description.trim(),
        status: columnId as "todo" | "in-progress" | "in-review" | "done",
      })
    }

    handleClose()
  }

  const handleDelete = () => {
    if (editingTask) {
      deleteTask(editingTask.id)
      handleClose()
    }
  }
  useEffect(() => {
    setInternalOpen(open || false)
  }, [open])

  const handleClose = () => {
    setInternalOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
          >
            <IconPlus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Update the task details or delete it."
                : "Add a new task to this column."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Write the task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the task"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {editingTask ? (
              <>
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={!title.trim()}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <IconTrash className="h-4 w-4" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={!title.trim()}
                >
                  Create
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
