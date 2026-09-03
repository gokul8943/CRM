import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt, {
  type JwtPayload,
} from "jsonwebtoken";


export type UserRole = "admin" | "agent";
// Extend Express Request

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: UserRole;
  };
}

interface AccessTokenPayload
  extends JwtPayload {
  id: string;
  email?: string;
  type: "access";
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    req.cookies?.crm_access_token;

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token missing",
    });
  }

  const accessSecret =
    process.env.JWT_ACCESS_SECRET;

  if (!accessSecret) {
    console.error(
      "JWT_ACCESS_SECRET is not configured"
    );

    return res.status(500).json({
      message:
        "Authentication configuration error",
    });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      accessSecret
    ) as AccessTokenPayload;

    // Make sure this is an access token
    if (decoded.type !== "access") {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    if (!decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as UserRole,
    };

    next();
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({
        message: "Access token expired",
      });
    }

    if (
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    console.error(
      "Authentication error:",
      error
    );

    return res.status(500).json({
      message:
        "Authentication failed",
    });
  }
};