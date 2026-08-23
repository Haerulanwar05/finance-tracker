import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { extractReceiptWithGemini } from "@/features/ocr/lib/gemini-ocr";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Sesi tidak valid." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File gambar struk wajib disertakan." },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/jpg"];
    if (!validMimes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Format file tidak didukung. Harap upload gambar JPEG, PNG, atau WEBP." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save image locally in public/uploads/receipts/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);
    const receiptUrl = `/uploads/receipts/${uniqueFileName}`;

    // Execute Gemini AI Vision OCR
    const parsedData = await extractReceiptWithGemini(buffer, file.type);
    parsedData.receiptUrl = receiptUrl;

    return NextResponse.json({
      success: true,
      message: "Struk belanja berhasil dipindai oleh AI!",
      data: parsedData,
    });
  } catch (error) {
    console.error("API /api/ocr/receipt error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses gambar struk.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
