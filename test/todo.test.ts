import supertest from "supertest"
import { app } from "../src/app/server"
import { TodoTest, UserTest } from "./test-util"
import { logger } from "../src/app/logging"

describe('POST /api/todos', () => {
    let token: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
    })

    afterEach(async () => {
        await UserTest.delete()
        await TodoTest.delete()
    })

    it('should be able to create todo', async () => {
        const response = await supertest(app)
            .post("/api/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "test",
                description: "test",
                isCompleted: true
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.isCompleted).toBe(true)
    })

    it('should reject create todo if data is invalid', async () => {
        const response = await supertest(app)
            .post("/api/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "",
                description: "",
                isCompleted: true
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject create todo if token is invalid', async () => {
        const response = await supertest(app)
            .post("/api/todos")
            .set("Authorization", `Bearer test`)
            .send({
                title: "test",
                description: "test",
                isCompleted: true
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/todos/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await TodoTest.create(userId)
    })

    afterEach(async () => {
        await UserTest.delete()
        await TodoTest.delete()
    })

    it('should be able to get todo', async () => {
        const todo = await TodoTest.get(userId)
        const response = await supertest(app)
            .get(`/api/todos/${todo.id}`)
            .set("Authorization", `Bearer ${token}`)
        
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("test")
        expect(response.body.data.description).toBe("test")
        expect(response.body.data.isCompleted).toBe(false)
    })

    it('should reject get todo if token is invalid', async () => {
        const todo = await TodoTest.get(userId)
        const response = await supertest(app)
            .get(`/api/todos/${todo.id}`)
            .set("Authorization", `Bearer salah`)
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('GET /api/todos', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id

        await TodoTest.create(userId, { title: "test", description: "test", isCompleted: false })
        await TodoTest.create(userId, { title: "coba", description: "coba", isCompleted: true })
    })

    afterEach(async () => {
        await UserTest.delete()
        await TodoTest.delete()
    })

    it('should be able to get all todos', async () => {
        const response = await supertest(app)
            .get(`/api/todos`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data).toHaveLength(2)

        const [todo1, todo2] = response.body.data

        expect(todo1.title).toBe("test")
        expect(todo1.description).toBe("test")
        expect(todo1.isCompleted).toBe(false)

        expect(todo2.title).toBe("coba")
        expect(todo2.description).toBe("coba")
        expect(todo2.isCompleted).toBe(true)
    })

    it('should reject get all todos if token is invalid', async () => {
        const response = await supertest(app)
            .get(`/api/todos`)
            .set("Authorization", `Bearer ytest`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(Array.isArray(response.body.errors)).toBeDefined()
    })
})

describe('PATCH /api/todos/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await TodoTest.create(userId)
    })

    afterEach(async () => {
        await UserTest.delete()
        await TodoTest.delete()
    })

    it('should be able to update todo', async () => {
        const todo = await TodoTest.get(userId)
        const response = await supertest(app)
            .patch(`/api/todos/${todo.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "update",
                description: "update",
                isCompleted: false
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("update")
        expect(response.body.data.description).toBe("update")
        expect(response.body.data.isCompleted).toBe(false)
    })

    it('should reject update todo if token is invalid', async () => {
        const todo = await TodoTest.get(userId)
        const response = await supertest(app)
            .patch(`/api/todos/${todo.id}`)
            .set("Authorization", `Bearer salah`)
            .send({
                title: "update",
                description: "update",
                isCompleted: false
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject update todo if data is invalid', async () => {
        const todo = await TodoTest.get(userId)
        const response = await supertest(app)
            .patch(`/api/todos/${todo.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "",
                description: "",
                isCompleted: false
            })
        
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})

describe('DELETE /api/todos/:id', () => {
    let token: string
    let userId: string

    beforeEach(async () => {
        const user = await UserTest.create()
        token = user.token!
        userId = user.id
        await TodoTest.create(userId)
    })

    afterEach(async () => {
        await UserTest.delete()
        await TodoTest.delete()
    })

    it('should be able to logout', async () => {
        const todo = await TodoTest.get(userId)
        const response = await supertest(app)
            .delete(`/api/todos/${todo.id}`)
            .set("Authorization", `Bearer ${token}`)

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("OK")
    })

    it('should reject logout if token is invalid', async () => {
        const todo = await TodoTest.get(userId)
        const response = await supertest(app)
            .delete(`/api/todos/${todo.id}`)
            .set("Authorization", `Bearer token`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should reject logout if todo id is invalid', async () => {
        const response = await supertest(app)
            .delete(`/api/todos/todoId`)
            .set("Authorization", `Bearer token`)

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })
})