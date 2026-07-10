import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../db/index.js";
import { storefronts } from "../db/schema.js";
import { eq } from "drizzle-orm";
import authRoutes from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static frontend in production
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// Auth routes
app.use("/api/auth", authRoutes);

// GET all storefronts (for dashboard lookup — public)
app.get("/api/storefronts", (_req, res) => {
  try {
    const all = db.select().from(storefronts).all();
    res.json(all);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single storefront by slug (public)
app.get("/api/storefronts/:slug", (req, res) => {
  try {
    const biz = db
      .select()
      .from(storefronts)
      .where(eq(storefronts.slug, req.params.slug))
      .get();
    if (!biz) {
      return res.status(404).json({ error: "Storefront not found" });
    }
    res.json(biz);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST create storefront (legacy — no auth, no password)
app.post("/api/storefronts", (req, res) => {
  try {
    const { businessName, ownerName, phone, email, website, services, serviceArea, description, slug } = req.body;

    if (!businessName || !phone || !services || !slug) {
      return res.status(400).json({ error: "Missing required fields: businessName, phone, services, slug" });
    }

    // Check if slug is taken
    const existing = db
      .select()
      .from(storefronts)
      .where(eq(storefronts.slug, slug))
      .get();

    if (existing) {
      return res.status(409).json({ error: "This URL is already taken. Please choose another." });
    }

    const result = db
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
      })
      .returning()
      .get();

    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback: serve index.html for client-side routing
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.status(200).json({ message: "Doorway API is running" });
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Doorway API server running on http://localhost:${PORT}`);
});