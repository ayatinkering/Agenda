import type { Request, Response, NextFunction } from "express";
import { descopeClient } from "../config/descope.js";

// authentication checkpoint: it checks whether an incoming request has a valid Descope session 
// before allowing it to reach a protected route

// 1. Defines the authentication data shape
export type AuthContext = {
  authUserId: string;
  email?: string;
  name?: string;
  userId: string;
  token: Record<string, unknown>;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export async function requireSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
    // 2. Reads the session token
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length).trim() // removes "Bearer " and keeps just the token
    : null;

  // 3. Rejects requests without a token
  if (!token) {
    res.status(401).json({ error: "Unauthorized", success: false });
    return; // HTTP 401 means authentication is required or invalid
  }

  // 4. Validates the token and reads its claims
  try { 
    const authInfo = await descopeClient.validateSession(token);
    const claims = authInfo.token as Record<string, unknown>;
    const authUserId = String(claims.sub ?? "");

    if (!authInfo) {
      res.status(401).json({ error: "Unauthorized", success: false });
      return;
    }

    const email = typeof claims.email === "string" ? claims.email : undefined;

    // 5. Allows the request to continue
    next();
  } catch {
    res.status(401).json({ error: "session expired" });
  }
}