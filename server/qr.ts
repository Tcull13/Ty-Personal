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
 * GET /api/:slug/qr/png
 * Returns a high-res PNG of the QR code (for stickers, business cards, etc.)
 * Query params: size (default 400, max 2000)
 */
router.get("/:slug/qr/png", async (req: Request, res: Response) => {
  try {
    const biz = lookupStorefront(req.params.slug);
    if (!biz) {
      return res.status(404).json({ error: "Storefront not found" });
    }

    const size = Math.min(parseInt(req.query.size as string) || 400, 2000);
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
 * POST /api/:slug/qr/pdf
 * Generates a printable PDF with the business's QR code.
 * Body: { size: "truck" | "flyer" }
 * - Truck: ~4x4 inches
 * - Flyer: ~3x3 inches
 */
router.post("/:slug/qr/pdf", async (req: Request, res: Response) => {
  try {
    const biz = lookupStorefront(req.params.slug);
    if (!biz) {
      return res.status(404).json({ error: "Storefront not found" });
    }

    const size = req.body.size === "flyer" ? "flyer" : "truck";
    const isTruck = size === "truck";

    // Dimensions in points (1 inch = 72 points)
    const qrSize = isTruck ? 4 * 72 : 3 * 72; // 4" or 3"
    const pageWidth = isTruck ? 5.5 * 72 : 4 * 72; // 5.5" or 4"
    const pageHeight = isTruck ? 5.5 * 72 : 4 * 72; // 5.5" or 4"
    const margin = 36; // 0.5 inch margin

    const url = `${req.protocol}://${req.get("host")}/${biz.slug}`;

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(url, {
      type: "png",
      width: qrSize * 2, // 2x resolution for crispness
      margin: 1,
      color: {
        dark: "#1A1A2E",
        light: "#FFFFFF",
      },
    });

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Embed QR image
    const qrImage = await pdfDoc.embedPng(qrBuffer);
    const qrDims = qrImage.scaleToFit(qrSize, qrSize);

    // Center QR code horizontally
    const qrX = (pageWidth - qrDims.width) / 2;
    const qrY = pageHeight - margin - qrDims.height - 50;

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrDims.width,
      height: qrDims.height,
    });

    // Business name above QR
    const nameSize = isTruck ? 16 : 13;
    const nameWidth = fontBold.widthOfTextAtSize(biz.businessName, nameSize);
    page.drawText(biz.businessName, {
      x: (pageWidth - nameWidth) / 2,
      y: qrY + qrDims.height + 12,
      size: nameSize,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.18),
    });

    // "Scan to visit my page" text below QR
    const tagline = "Scan to visit my page";
    const taglineSize = isTruck ? 11 : 9;
    const taglineWidth = font.widthOfTextAtSize(tagline, taglineSize);
    page.drawText(tagline, {
      x: (pageWidth - taglineWidth) / 2,
      y: qrY - 22,
      size: taglineSize,
      font: font,
      color: rgb(0.42, 0.45, 0.5),
    });

    // URL below tagline
    const urlSize = isTruck ? 9 : 8;
    const urlWidth = font.widthOfTextAtSize(url, urlSize);
    page.drawText(url, {
      x: (pageWidth - urlWidth) / 2,
      y: qrY - 22 - urlSize - 6,
      size: urlSize,
      font: font,
      color: rgb(0.1, 0.48, 0.48),
    });

    // "Powered by Doorway" at bottom
    const footer = "Powered by Doorway";
    const footerSize = 7;
    const footerWidth = font.widthOfTextAtSize(footer, footerSize);
    page.drawText(footer, {
      x: (pageWidth - footerWidth) / 2,
      y: 10,
      size: footerSize,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${biz.slug}-qr-${size}.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;