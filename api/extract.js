import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  EXTRACT_PRODUCTS_PROMPT,
  GEMINI_MODEL,
} from "../shared/constants/prompt.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !mimeType) {
      return res
        .status(400)
        .json({ error: "imageBase64와 mimeType은 필수입니다." });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(mimeType)) {
      return res
        .status(400)
        .json({ error: "지원하지 않는 이미지 형식입니다." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const result = await model.generateContent([
      EXTRACT_PRODUCTS_PROMPT,
      { inlineData: { data: imageBase64, mimeType } },
    ]);

    const text = result.response.text();
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const products = JSON.parse(cleaned);

    if (!Array.isArray(products)) {
      return res
        .status(500)
        .json({ error: "OCR 결과가 올바른 형식이 아닙니다." });
    }

    return res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "OCR 추출에 실패했습니다." });
  }
}
