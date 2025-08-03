import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

// Extend Request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload & { userId: string; role: string };
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD!);
    req.user = decoded as JwtPayload & { userId: string; role: string };
    next(); // ✅ must call next(), don't return response
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};
