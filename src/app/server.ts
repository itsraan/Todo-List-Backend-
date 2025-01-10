import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import { publicApi } from "../routes/public-api"
import { api } from "../routes/api"
import { errorMiddleware } from "../middleware/error-middleware"

dotenv.config()
export const app = express()

app.use(cors({
    origin: process.env.CLIENT_PORT,
    credentials: true
}))

app.use(express.json())

app.use(publicApi)
app.use(api)

app.use(errorMiddleware)