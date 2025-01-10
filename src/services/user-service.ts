import { CreateUserRequest, UpdateUserRequest, LoginUserRequest, UserResponse, toUserResponse } from "../models/user-model"
import { Validation } from "../util/validation/validation"
import { UserValidation } from "../util/validation/user-validation"
import { prismaClient } from "../app/database"
import { ResponseError } from "../util/error/error"
import { User } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = await Validation.validate(UserValidation.REGISTER, request)
        const emailExist = await prismaClient.user.findUnique({
            where: { email: registerRequest.email }
        })

        if(emailExist) {
            throw new ResponseError(400, "Email already exists")
        }

        const hashedPassword = await bcrypt.hash(registerRequest.password, 10)
        const user = await prismaClient.user.create({
            data: {
                name: registerRequest.name,
                email: registerRequest.email,
                password: hashedPassword
            }
        })

        return toUserResponse(user)
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user)
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        const updateRequest = await Validation.validate(UserValidation.UPDATE, request)
        const updateData: any = {} 

        if(updateRequest.name) {
            updateData.name = updateRequest.name
        }

        if(updateRequest.password) {
            updateData.password = await bcrypt.hash(updateRequest.password, 10)
        }

        const result = await prismaClient.user.update({
            where: { id: user.id }, data: updateData
        })

        return toUserResponse(result)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = await Validation.validate(UserValidation.LOGIN, request)
        let user = await prismaClient.user.findUnique({
            where: { email: loginRequest.email }
        })

        if(!user) {
            throw new ResponseError(400, "Email or Password invalid")
        }

        const comparePassword = await bcrypt.compare(loginRequest.password, user.password)
        if(!comparePassword) {
            throw new ResponseError(400, "Email or Password invalid")
        }

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.EXPIRED_TOKEN })

        user = await prismaClient.user.update({
            where: { email: user.email }, data: { token: token }
        })

        return toUserResponse(user)
    }

    static async logout(user: User): Promise<UserResponse> {
        const response = await prismaClient.user.update({
            where: { id: user.id }, data: { token: null }
        })

        return toUserResponse(response)
    }
}