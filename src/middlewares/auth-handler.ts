import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.ts";
import env from "@/env.ts";

const authHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let { token } = req.cookies;
  if (!token) {
    const authHeader: string | undefined = req.headers.authorization;
    token = authHeader?.split(" ")[1];
    console.log(token);
  }
  if (!env.MY_JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret is not defined" });
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, env.MY_JWT_SECRET);
      req.user = <JwtPayload>decoded;
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ error: "No token provided" });
  }

  next();
};

export default authHandler;
