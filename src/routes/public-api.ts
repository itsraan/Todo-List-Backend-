import express from "express"
import { UserController } from "../controllers/user-controller"

export const publicApi = express.Router()

publicApi.post("/api/register", UserController.register)
publicApi.post("/api/login", UserController.login)