import { Column } from "../lib/types/types"

export const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Design interface",
        description: "Create the user interface design",
        status: "todo",
      },
      {
        id: 2,
        title: "Implement backend",
        description: "Develop the REST API",
        status: "todo",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: 3,
        title: "Testing",
        description: "Perform application testing",
        status: "in-progress",
      },
    ],
  },
  {
    id: "in-review",
    title: "In Review",
    tasks: [
      {
        id: 5,
        title: "Code review",
        description: "Review pull requests and provide feedback",
        status: "in-review",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: 4,
        title: "Initial setup",
        description: "Configure project and dependencies",
        status: "done",
      },
    ],
  },
]
