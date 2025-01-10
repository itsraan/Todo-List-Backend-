import { prismaClient } from "../src/app/database"
import { User, Todo } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: { email: "test@gmail.com" }
        })
    }

    static async create() {
        const user = await prismaClient.user.create({
            data: {
                name: "test",
                email: "test@gmail.com",
                password: await bcrypt.hash("Test@2003", 10)
            }
        })

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET_KEY!, {expiresIn: process.env.EXPIRED_TOKEN})

        const updateUser = await prismaClient.user.update({
            where: { id: user.id },data: { token: token }
        })

        return updateUser
    }

    static async get() {
        const user = await prismaClient.user.findUnique({
            where: { email: "test@gmail.com" }
        })

        if(!user) {
            throw new Error("User not found")
        }

        return user
    }
}

export class TodoTest {
    static async delete() {
        await prismaClient.todo.deleteMany({
            where: {
                author: { email: "test@gmail.com" }
            }
        })
    }

    static async create(authorId: string, data: Partial<{ title: string, description: string, isCompleted: boolean }> = {}) {
        await prismaClient.todo.create({
            data: {
                title: data.title || "test",
                description: data.description || "test",
                isCompleted: data.isCompleted ?? false,
                author: {
                    connect: {
                        id: authorId,
                    }
                }
            }
        })
    }

    static async get(authorId: string): Promise<Todo> {
        const todo = await prismaClient.todo.findFirst({
            where: {
                authorId: authorId
            }
        })

        if(!todo) {
            throw new Error("Todo not found")
        }

        return todo
    }
}