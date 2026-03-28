import type { IProduct } from "~/types";

function isLocalEnvironment(): boolean {
  return window.location.hostname === "localhost";
}

/**
 * 이미지 파일에서 상품 목록을 추출한다.
 * 로컬 환경에서는 클라이언트에서 직접 Gemini API를 호출하고,
 * 프로덕션에서는 /api/extract를 경유한다.
 * @param file 업로드된 이미지 파일
 * @return 추출된 상품 목록
 */
export async function extractProducts({
  file,
}: {
  file: File;
}): Promise<{ items: IProduct[] }> {
  const base64 = await fileToBase64({ file });

  let products;

  if (isLocalEnvironment()) {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const { EXTRACT_PRODUCTS_PROMPT, GEMINI_3_FLASH_PREVIEW } =
      // @ts-expect-error — JS 파일 (Vercel Serverless 호환)
      await import("../../shared/constants/prompt.js");

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_3_FLASH_PREVIEW });

    const result = await model.generateContent([
      EXTRACT_PRODUCTS_PROMPT,
      { inlineData: { data: base64, mimeType: file.type } },
    ]);

    const text = result.response.text();
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    products = JSON.parse(cleaned);
  } else {
    const response = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
    });

    if (!response.ok) {
      throw new Error("OCR 추출 실패");
    }

    const data = await response.json();

    products = data.products;
  }

  return {
    items: products.map((p: Omit<IProduct, "id">) => ({
      ...p,
      id: crypto.randomUUID(),
    })),
  };
}

/**
 * File 객체를 Base64 문자열로 변환한다.
 * @param file 변환할 파일
 * @return Base64 인코딩된 문자열 (data URI prefix 제외)
 */
function fileToBase64({ file }: { file: File }): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
