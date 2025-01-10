import { app } from "./app/server"

app.listen(process.env.SERVICE_PORT, () => {
    console.log(`Server running on port ${process.env.SERVICE_PORT}`)
})