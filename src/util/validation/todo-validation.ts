import { ZodType, z } from "zod"

export class TodoValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(1000).optional(),
        isCompleted: z.boolean().optional()
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.string().min(1, "Address ID is required"),
        title: z.string().min(1).max(100).optional(),
        description: z.string().min(1).max(1000).optional(),
        isCompleted: z.boolean().optional()
    })
}