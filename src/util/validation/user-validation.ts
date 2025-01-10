import { ZodType, z } from "zod"

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
        email: z.string().email().max(100),
        password: z.string().min(8).max(20).refine((value) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/.test(value),
            { message: "Must contain at least one lowercase letter, one uppercase letter, one number, and one symbol" }
        })
    })

    static readonly LOGIN: ZodType = z.object({
        email: z.string().email().max(100),
        password: z.string().min(8).max(20).refine((value) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/.test(value),
            { message: "Must contain at least one lowercase letter, one uppercase letter, one number, and one symbol" }
        })
    })

    static readonly UPDATE: ZodType = z.object({
        name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
        password: z.string().min(8).max(20).refine((value) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/.test(value),
            { message: "Must contain at least one lowercase letter, one uppercase letter, one number, and one symbol" }
        })
    })
}