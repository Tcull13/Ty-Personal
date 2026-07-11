import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../db/index.js";
import { storefronts, sessions } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "./middleware.js";

const router = Router();

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const TOKEN_BYTES = 48; // 96-char hex string

function generateToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString("hex");
}

function generateExpiry(): string {
  const d = new Date(Date.now() + SESSION_DURATION_MS);
  return d.toISOString().replace("Z", ""); // SQLite datetime format
}

/**
 * POST /api/auth/signup
 * Creates a new storefront with a password, starts a session.
 * Body: { businessName, phone, services, slug, password, ownerName?, email?, website?, serviceArea?, description? }
 */
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      ownerName,
      phone,
      email,
      website,
      services,
      serviceArea,
      description,
      slug,
      password,
    } = req.body;

    // Validate required fields
    if (!businessName || !phone || !services || !slug || !password) {
      return res.status(400).json({
        error: "Missing required fields: businessName, phone, services, slug, password",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check slug uniqueness
    const existing = db
      .select()
      .from(storefronts)
      .where(eq(storefronts.slug, slug))
      .get();

    if (existing) {
      return res.status(409).json({ error: "This URL is already taken. Please choose another." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create storefront
    const biz = db
      .insert(storefronts)
      .values({
        businessName,
        ownerName: ownerName || "",
        phone,
        email: email || "",
        website: website || "",
        services,
        serviceArea: serviceArea || "",
        description: description || "",
        slug,
        passwordHash,
      })
      .returning()
      .get();

    // Create session
    const token = generateToken();
    const expiresAt = generateExpiry();

    db.insert(sessions)
      .values({
        storefrontId: biz.id,
        token,
        expiresAt,
      })
      .run();

    // Set cookie
    res.cookie("session", token, {
      httpOnly: true,
      maxAge: SESSION_DURATION_MS,
      sameSite: "lax",
      path: "/",
    });

    res.status(201).json({
      storefront: {
        id: biz.id,
        businessName: biz.businessName,
        phone: biz.phone,
        email: biz.email,
        slug: biz.slug,
        createdAt: biz.createdAt,
      },
      token,
      expiresAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/login
 * Verifies password and starts a session.
 * Body: { email, password }
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email and password" });
    }

    // Find storefront by email
    const biz = db
      .select()
      .from(storefronts)
      .where(eq(storefronts.email, email))
      .get();

    if (!biz) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!biz.passwordHash) {
      return res.status(401).json({
        error: "No password set. Please sign up via /api/auth/signup or reset your password.",
      });
    }

    // Verify password
    const valid = await bcrypt.compare(password, biz.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create session
    const token = generateToken();
    const expiresAt = generateExpiry();

    db.insert(sessions)
      .values({
        storefrontId: biz.id,
        token,
        expiresAt,
      })
      .run();

    // Set cookie
    res.cookie("session", token, {
      httpOnly: true,
      maxAge: SESSION_DURATION_MS,
      sameSite: "lax",
      path: "/",
    });

    res.json({
      storefront: {
        id: biz.id,
        businessName: biz.businessName,
        phone: biz.phone,
        email: biz.email,
        slug: biz.slug,
      },
      token,
      expiresAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/logout
 * Destroys the current session.
 */
router.post("/logout", (req: Request, res: Response) => {
  try {
    // Extract token from header or cookie
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (req.cookies?.session) {
      token = req.cookies.session;
    }

    if (token) {
      db.delete(sessions).where(eq(sessions.token, token)).run();
    }

    // Clear cookie
    res.clearCookie("session", { path: "/" });

    res.json({ message: "Logged out successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/auth/me
 * Returns the current authenticated storefront.
 */
router.get("/me", requireAuth, (req: Request, res: Response) => {
  res.json({ storefront: req.storefront });
});

export default router;