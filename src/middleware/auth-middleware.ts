import { Response, NextFunction } from "express"
import { prismaClient } from "../app/database"
import { UserRequest } from "../util/type/types"
import jwt, { JwtPayload } from "jsonwebtoken"

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader) {
            return res.status(400).json({
                errors: "Unauthorized: No authorization header found"
            })
        } 

        if(!authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                errors: "Unauthorized: Invalid authorization format"
            })
        }

        const token = authHeader.split(" ")[1]
        try {
            const secretKey = process.env.JWT_SECRET_KEY! 
            const decoded = jwt.verify(token, secretKey) as JwtPayload
            const user = await prismaClient.user.findUnique({
                where: {
                    id: decoded.id
                }
            })

            if(!user) {
                return res.status(400).json({
                    errors: "Unauthorized: User not found"
                })
            }

            req.user = user
            next()
        } catch (jwtError) {
            return res.status(400).json({
                errors: "Unauthorized: Invalid token"
            })
        }
    } catch (error) {
        return res.status(500).json({
            errors: "Internal server error"
        })
    }
}