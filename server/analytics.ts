import { Router, Request, Response } from "express";
import { db } from "../db/index.js";
import { storefronts, scans } from "../db/schema.js";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";
import { requireAuth } from "./middleware.js";

const router = Router();

/**
 * POST /api/storefronts/:slug/scan
 * Records a scan event (view, scan, or call_click).
 * Public — no auth required.
 */
router.post("/storefronts/:slug/scan", (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    if (!type || !["view", "scan", "call_click"].includes(type)) {
      return res.status(400).json({ error: "Invalid type. Must be: view, scan, or call_click" });
    }

    const biz = db
      .select()
      .from(storefronts)
      .where(eq(storefronts.slug, req.params.slug))
      .get();

    if (!biz) {
      return res.status(404).json({ error: "Storefront not found" });
    }

    const referrer = req.headers.referer || "";
    const ip = (req.headers["x-forwarded-for"] as string) || req.ip || "";
    const userAgent = req.headers["user-agent"] || "";

    db.insert(scans)
      .values({
        storefrontId: biz.id,
        type,
        referrer: referrer as string,
        ip: ip as string,
        userAgent: userAgent as string,
      })
      .run();

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/storefronts/:slug/analytics
 * Returns analytics data for the storefront.
 * Requires auth — the storefront must belong to the authenticated user.
 */
router.get("/storefronts/:slug/analytics", requireAuth, (req: Request, res: Response) => {
  try {
    const biz = db
      .select()
      .from(storefronts)
      .where(eq(storefronts.slug, req.params.slug))
      .get();

    if (!biz) {
      return res.status(404).json({ error: "Storefront not found" });
    }

    // Verify ownership
    if (req.storefront?.id !== biz.id) {
      return res.status(403).json({ error: "You don't have access to this storefront's analytics" });
    }

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Total counts
    const totalViews = db
      .select({ count: sql<number>`count(*)` })
      .from(scans)
      .where(and(eq(scans.storefrontId, biz.id), eq(scans.type, "view")))
      .get()?.count || 0;

    const totalScans = db
      .select({ count: sql<number>`count(*)` })
      .from(scans)
      .where(and(eq(scans.storefrontId, biz.id), eq(scans.type, "scan")))
      .get()?.count || 0;

    const totalCalls = db
      .select({ count: sql<number>`count(*)` })
      .from(scans)
      .where(and(eq(scans.storefrontId, biz.id), eq(scans.type, "call_click")))
      .get()?.count || 0;

    // Today's counts
    const viewsToday = db
      .select({ count: sql<number>`count(*)` })
      .from(scans)
      .where(
        and(
          eq(scans.storefrontId, biz.id),
          eq(scans.type, "view"),
          sql`date(created_at) = ${today}`
        )
      )
      .get()?.count || 0;

    const scansToday = db
      .select({ count: sql<number>`count(*)` })
      .from(scans)
      .where(
        and(
          eq(scans.storefrontId, biz.id),
          eq(scans.type, "scan"),
          sql`date(created_at) = ${today}`
        )
      )
      .get()?.count || 0;

    const callsToday = db
      .select({ count: sql<number>`count(*)` })
      .from(scans)
      .where(
        and(
          eq(scans.storefrontId, biz.id),
          eq(scans.type, "call_click"),
          sql`date(created_at) = ${today}`
        )
      )
      .get()?.count || 0;

    // Views by day (last 7 days)
    const viewsByDay: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      const count = db
        .select({ count: sql<number>`count(*)` })
        .from(scans)
        .where(
          and(
            eq(scans.storefrontId, biz.id),
            eq(scans.type, "view"),
            sql`date(created_at) = ${dateStr}`
          )
        )
        .get()?.count || 0;

      viewsByDay.push({ date: dateStr, count });
    }

    // Recent scans (last 10)
    const recentScans = db
      .select({
        type: scans.type,
        createdAt: scans.createdAt,
      })
      .from(scans)
      .where(eq(scans.storefrontId, biz.id))
      .orderBy(desc(scans.createdAt))
      .limit(10)
      .all()
      .map((s) => ({
        type: s.type,
        created_at: s.createdAt,
      }));

    res.json({
      total_views: totalViews,
      total_scans: totalScans,
      total_calls: totalCalls,
      views_today: viewsToday,
      scans_today: scansToday,
      calls_today: callsToday,
      views_by_day: viewsByDay,
      recent: recentScans,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;