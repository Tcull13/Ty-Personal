import { Router, Request, Response } from "express";
import QRCode from "qrcode";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { db } from "../db/index.js";
import { storefronts } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

/** Helper: look up storefront by slug, return 404 if not found */
function lookupStorefront(slug: string) {
  const biz = db
    .select()
    .from(storefronts)
    .where(eq(storefronts.slug, slug))
    .get();
  return biz;
}

/**
 * GET /api/storefronts/:slug/qr.png
 * Returns a high-res PNG of the QR code (1000x1000px minimum).
 * Query param: size (default 1000, max 2000)
 */
router.get("/storefronts/:slug/qr.png", async (req: Request, res: Response) => {
  try {
    const biz = lookupStorefront(req.params.slug);
    if (!biz) {
      return res.status(404).json({ error: "Storefront not found" });
    }

    const size = Math.min(
      parseInt(req.query.size as string) || 1000,
      2000
    );
    const url = `${req.protocol}://${req.get("host")}/${biz.slug}`;

    const qrBuffer = await QRCode.toBuffer(url, {
      type: "png",
      width: size,
      margin: 2,
      color: {
        dark: "#1A1A2E",
        light: "#FFFFFF",
      },
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${biz.slug}-qr.png"`
    );
    res.send(qrBuffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/storefronts/:slug/qr/pdf
 * Generates a print-ready PDF with the business's QR code.
 * 4x4 inch truck magnet size with QR code, business name, and tagline.
 */
router.get("/storefronts/:slug/qr/pdf", async (req: Request, res: Response) => {
  try {
    const biz = lookupStorefront(req.params.slug);
    if (!biz) {
      return res.status(404).json({ error: "Storefront not found" });
    }

    // Dimensions in points (1 inch = 72 points)
    const pageSize = 4 * 72; // 4x4 inches
    const qrSize = 3.2 * 72; // 3.2" QR code with some padding
    const margin = 24; // 0.33 inch margin

    const url = `${req.protocol}://${req.get("host")}/${biz.slug}`;

    // Generate QR code as PNG buffer at 2x resolution for crispness
    const qrBuffer = await QRCode.toBuffer(url, {
      type: "png",
      width: qrSize * 2,
      margin: 1,
      color: {
        dark: "#1A1A2E",
        light: "#FFFFFF",
      },
    });

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([pageSize, pageSize]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Embed QR image
    const qrImage = await pdfDoc.embedPng(qrBuffer);
    const qrDims = qrImage.scaleToFit(qrSize, qrSize);

    // Center QR code horizontally, slightly above vertical center
    const qrX = (pageSize - qrDims.width) / 2;
    const qrY = (pageSize - qrDims.height) / 2 + 24;

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrDims.width,
      height: qrDims.height,
    });

    // Business name above QR
    const nameSize = 14;
    const nameWidth = fontBold.widthOfTextAtSize(biz.businessName, nameSize);
    page.drawText(biz.businessName, {
      x: (pageSize - nameWidth) / 2,
      y: qrY + qrDims.height + 14,
      size: nameSize,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.18),
    });

    // "Scan to visit my page" text below QR
    const tagline = "Scan to visit my page";
    const taglineSize = 10;
    const taglineWidth = font.widthOfTextAtSize(tagline, taglineSize);
    page.drawText(tagline, {
      x: (pageSize - taglineWidth) / 2,
      y: qrY - 20,
      size: taglineSize,
      font: font,
      color: rgb(0.42, 0.45, 0.5),
    });

    // URL below tagline
    const shortUrl = `doorway.app/${biz.slug}`;
    const urlSize = 9;
    const urlWidth = font.widthOfTextAtSize(shortUrl, urlSize);
    page.drawText(shortUrl, {
      x: (pageSize - urlWidth) / 2,
      y: qrY - 20 - urlSize - 6,
      size: urlSize,
      font: font,
      color: rgb(0.1, 0.48, 0.48),
    });

    // "Powered by Doorway" at bottom
    const footer = "Powered by Doorway";
    const footerSize = 7;
    const footerWidth = font.widthOfTextAtSize(footer, footerSize);
    page.drawText(footer, {
      x: (pageSize - footerWidth) / 2,
      y: 10,
      size: footerSize,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${biz.slug}-qr.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;