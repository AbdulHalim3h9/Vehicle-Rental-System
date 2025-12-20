import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
      return (req: Request, res: Response, next: NextFunction) => {
            try {
                  const token = req.headers.authorization;
                  if (!token) {
                        return res.status(403).json({
                              success: false,
                              message: "Unauthorized"
                        })
                  }
                  const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload
                  req.user = decoded;
                  if (roles.length && !roles.includes(decoded.role)) {
                        return res.status(403).json({
                              success: false,
                              message: "Unauthorized"
                        })
                  }
                  next();
            } catch (err: any) {
                  res.status(500).json({
                        success: false,
                        message: err.message
                  })
            }
      }
}

export default auth