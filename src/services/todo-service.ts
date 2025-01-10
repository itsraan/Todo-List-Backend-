import { CreateTodoRequest, UpdateTodoRequest, TodoResponse, toTodoResponse } from "../models/todo-model"
import { Validation } from "../util/validation/validation"
import { TodoValidation } from "../util/validation/todo-validation"
import { ResponseError } from "../util/error/error"
import { Todo, User } from "@prisma/client"
import { prismaClient } from "../app/database"

export class TodoService {
    static async create(user: User, request: CreateTodoRequest): Promise<TodoResponse> {
        const createRequest = await Validation.validate(TodoValidation.CREATE, request)
        if(!user) {
            throw new ResponseError(400, "User not found")
        }

        const record = {
            ...createRequest,
            ...{ authorId: user.id }
        }

        const response = await prismaClient.todo.create({
            data: record
        })

        return toTodoResponse(response)
    }

    static async checkTodoMustBeExist(authorId: string, id: string): Promise<Todo> {
        const response = await prismaClient.todo.findFirst({
            where: {
                id: id,
                authorId: authorId
            }
        })

        if(!response) {
            throw new ResponseError(400, "Todo not found")
        }

        return response
    }

    static async get(user: User, id: string): Promise<TodoResponse> {
        const response = await this.checkTodoMustBeExist(user.id, id)
        return toTodoResponse(response)
    }

    static async getAll(user: User): Promise<TodoResponse[]> {
        const response = await prismaClient.todo.findMany({
            where: { authorId: user.id }
        })

        return response.map(toTodoResponse)
    }

    static async update(user: User, request: UpdateTodoRequest): Promise<TodoResponse> {
        const updateRequest = await Validation.validate(TodoValidation.UPDATE, request)
        const response = await prismaClient.todo.update({
            where: { 
                id: updateRequest.id 
            },
            data: {
                ...updateRequest,
                authorId: user.id 
            }
        })

        return toTodoResponse(response)
    }

    static async delete(user: User, id: string): Promise<TodoResponse> {
        await this.checkTodoMustBeExist(user.id, id)
        const response = await prismaClient.todo.delete({
            where: {
                id: id,
                authorId: user.id
            }
        })

        return toTodoResponse(response)
    }

}