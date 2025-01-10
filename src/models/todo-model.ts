import { Todo } from "@prisma/client"

export type TodoResponse = {
    id: string,
    title: string,
    description: string,
    isCompleted: boolean
}

export type CreateTodoRequest = {
    title: string,
    description?: string,
    isCompleted?: boolean
}

export type UpdateTodoRequest = {
    id: string
    title?: string,
    description?: string,
    isCompleted?: boolean
}

export function toTodoResponse(todo: Todo): TodoResponse {
    return {
        id: todo.id,
        title: todo.title,
        description: todo.description!,
        isCompleted: todo.isCompleted
    }
}