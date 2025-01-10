import { User } from "@prisma/client"

export type UserResponse = {
    id: string
    name: string
    email: string
    token?: string
}

export type CreateUserRequest = {
    name: string
    email: string
    password: string
}

export type LoginUserRequest = {
    email: string
    password: string
}

export type UpdateUserRequest = {
    name?: string
    password?: string
}

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        token: user.token!
    }
}