import { Column } from "@/lib/types/types"

export const initialColumns: Column[] = [
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
]
