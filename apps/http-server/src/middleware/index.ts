import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db/client";

type Decoded = {
  id: string;
};

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"] || "";
  try {
    const decoded: Decoded = jwt.verify(token, JWT_SECRET) as Decoded;

    if (decoded.id) {
      const result = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (result) {
        req.userId = result.id;
        return next();
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
}
