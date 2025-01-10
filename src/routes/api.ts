import express, { RequestHandler } from "express"
import { authMiddleware } from "../middleware/auth-middleware"
import { UserController } from "../controllers/user-controller"
import { TodoController } from "../controllers/todo-controller"

export const api = express.Router()
api.use(authMiddleware as RequestHandler)

api.get("/api/users", UserController.get)
api.patch("/api/users", UserController.update)
api.delete("/api/logout", UserController.logout)

api.post("/api/todos", TodoController.create)
api.get("/api/todos", TodoController.getAll)
api.get("/api/todos/:id", TodoController.get)
api.patch("/api/todos/:id", TodoController.update)
api.delete("/api/todos/:id", TodoController.delete)