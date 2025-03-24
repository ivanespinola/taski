export type Task = {
  id: number
  title: string
  description: string
  status: "todo" | "in-progress" | "in-review" | "done"
}

export type Column = {
  id: string
  title: string
  tasks: Task[]
}
