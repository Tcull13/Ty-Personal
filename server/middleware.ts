import { Request, Response, NextFunction } from "express";
import { db } from "../db/index.js";
import { sessions, storefronts } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      storefront?: {
        id: number;
        businessName: string;
        phone: string;
        email: string | null;
        slug: string;
      };
      sessionToken?: string;
    }
  }
}

export interface AuthRequest extends Request {
  storefront?: {
    id: number;
    businessName: string;
    phone: string;
    email: string | null;
    slug: string;
  };
}

/**
 * Auth middleware — validates session token from:
 * 1. Authorization: Bearer <token>
 * 2. session cookie
 *
 * Attaches req.storefront and req.sessionToken on success.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from header or cookie
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (req.cookies?.session) {
      token = req.cookies.session;
    }

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Look up session
    const session = db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .get();

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    // Check expiry
    const expiresAt = new Date(session.expiresAt + "Z");
    if (expiresAt < new Date()) {
      // Clean up expired session
      db.delete(sessions).where(eq(sessions.id, session.id)).run();
      return res.status(401).json({ error: "Session expired" });
    }

    // Look up storefront
    const biz = db
      .select({
        id: storefronts.id,
        businessName: storefronts.businessName,
        phone: storefronts.phone,
        email: storefronts.email,
        slug: storefronts.slug,
      })
      .from(storefronts)
      .where(eq(storefronts.id, session.storefrontId))
      .get();

    if (!biz) {
      return res.status(401).json({ error: "Storefront not found" });
    }

    req.storefront = biz;
    req.sessionToken = token;
    next();
  } catch (err: any) {
    return res.status(500).json({ error: "Auth error: " + err.message });
  }
}