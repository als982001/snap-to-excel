import type { IProduct } from "~/types";

import { supabase } from "./supabase";

/**
 * 추출 결과를 Supabase에 저장한다.
 * @param userId 사용자 ID
 * @param imageName 이미지 파일명
 * @param items 추출된 상품 목록
 * @return 저장된 extraction row
 */
export async function saveExtraction({
  userId,
  imageName,
  items,
}: {
  userId: string;
  imageName: string;
  items: IProduct[];
}) {
  const { data: extraction, error: extError } = await supabase
    .from("extractions")
    .insert({ user_id: userId, image_name: imageName })
    .select()
    .single();

  if (extError) throw extError;

  const productRows = items.map((item) => ({
    extraction_id: extraction.id,
    code: item.code,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
  }));

  const { error: prodError } = await supabase
    .from("products")
    .insert(productRows);

  if (prodError) throw prodError;

  return { extraction };
}

/**
 * 사용자의 추출 이력을 조회한다.
 * @param userId 사용자 ID
 * @return 추출 이력 목록 (products 포함)
 */
export async function getExtractionHistory({ userId }: { userId: string }) {
  const { data, error } = await supabase
    .from("extractions")
    .select("*, products(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { data };
}

/**
 * 추출 이력을 삭제한다 (CASCADE로 products도 삭제).
 * @param extractionId 삭제할 extraction ID
 */
export async function deleteExtraction({
  extractionId,
}: {
  extractionId: string;
}) {
  const { error } = await supabase
    .from("extractions")
    .delete()
    .eq("id", extractionId);

  if (error) throw error;
}
