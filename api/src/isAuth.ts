import { RequestHandler, Request } from "express";
import jwt from 'jsonwebtoken';

export type ReqWithUserId = Request<{}, any, any, {}> & { userId: number };

export const isAuth: RequestHandler<{}, any, any, {}> = (req, _, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('Not authenticated');
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new Error('Not authenticated');
    }

    try {
        const payload: any = jwt.verify(token, 'dawdwad231dwa9u9dawd123121ijh8dfvdf78');
        (req as any).userId = payload.userId;
        next();
        return;
    } catch { }
};