import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Column, Task } from "../types/types"

interface TaskState {
  columns: Column[]
  sidebarTasks: Task[]
  addTask: (columnId: string, task: Omit<Task, "id">) => void
  addSidebarTask: (task: Omit<Task, "id">) => void
  updateTask: (taskId: number, updates: Partial<Task>) => void
  deleteTask: (taskId: number) => void
  moveTask: (
    taskId: number,
    sourceColumnId: string,
    targetColumnId: string
  ) => void
  reorderTasks: (columnId: string, taskIds: number[]) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      columns: [
        {
          id: "todo",
          title: "To Do",
          tasks: [
            {
              id: 1,
              title: "Welcome to Taski",
              description:
                "This is your first task. You can drag it between columns, edit it, or create new tasks",
              status: "todo",
            },
          ],
        },
        {
          id: "in-progress",
          title: "In Progress",
          tasks: [],
        },
        {
          id: "in-review",
          title: "In Review",
          tasks: [],
        },
        {
          id: "done",
          title: "Done",
          tasks: [],
        },
      ],
      sidebarTasks: [],

      addTask: (columnId: string, task: Omit<Task, "id">) =>
        set((state) => {
          const newTask = {
            ...task,
            id:
              Math.max(
                0,
                ...state.columns.flatMap((col) => col.tasks.map((t) => t.id))
              ) + 1,
          }
          return {
            columns: state.columns.map((col) =>
              col.id === columnId
                ? { ...col, tasks: [...col.tasks, newTask] }
                : col
            ),
          }
        }),

      addSidebarTask: (task: Omit<Task, "id">) =>
        set((state) => {
          const newTask = {
            ...task,
            id: Math.max(0, ...state.sidebarTasks.map((t) => t.id)) + 1,
          }
          return {
            sidebarTasks: [...state.sidebarTasks, newTask],
          }
        }),

      updateTask: (taskId: number, updates: Partial<Task>) =>
        set((state) => ({
          columns: state.columns.map((col) => ({
            ...col,
            tasks: col.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          })),
          sidebarTasks: state.sidebarTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),

      deleteTask: (taskId: number) =>
        set((state) => ({
          columns: state.columns.map((col) => ({
            ...col,
            tasks: col.tasks.filter((task) => task.id !== taskId),
          })),
          sidebarTasks: state.sidebarTasks.filter((task) => task.id !== taskId),
        })),

      moveTask: (
        taskId: number,
        sourceColumnId: string,
        targetColumnId: string
      ) =>
        set((state) => {
          const sourceColumn = state.columns.find(
            (col) => col.id === sourceColumnId
          )
          const targetColumn = state.columns.find(
            (col) => col.id === targetColumnId
          )
          if (!sourceColumn || !targetColumn) return state

          const task = sourceColumn.tasks.find((t) => t.id === taskId)
          if (!task) return state

          return {
            columns: state.columns.map((col) => {
              if (col.id === sourceColumnId) {
                return {
                  ...col,
                  tasks: col.tasks.filter((t) => t.id !== taskId),
                }
              }
              if (col.id === targetColumnId) {
                return {
                  ...col,
                  tasks: [
                    ...col.tasks,
                    { ...task, status: targetColumnId as Task["status"] },
                  ],
                }
              }
              return col
            }),
          }
        }),

      reorderTasks: (columnId: string, taskIds: number[]) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: taskIds
                    .map((id) => col.tasks.find((t) => t.id === id))
                    .filter(Boolean) as Task[],
                }
              : col
          ),
        })),
    }),
    {
      name: "task-storage",
    }
  )
)
