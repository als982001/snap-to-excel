import * as XLSX from "xlsx";
import type { IProduct } from "~/types";

/**
 * 상품 목록을 xlsx 파일로 다운로드한다.
 * @param items 상품 목록
 * @param fileName 파일명 (확장자 제외)
 */
export function downloadXlsx({
  items,
  fileName,
}: {
  items: IProduct[];
  fileName: string;
}) {
  const worksheetData = items.map((item) => ({
    상품코드: item.code,
    상품명: item.name,
    개수: item.quantity,
    단위: item.unit,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "상품목록");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * CSV 필드를 안전하게 이스케이프한다 (쉼표, 큰따옴표 포함 시 처리).
 * @param value 필드 값
 * @return 이스케이프된 문자열
 */
function escapeCsvField({ value }: { value: string | number }): string {
  const str = String(value);

  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * 상품 목록을 csv 파일로 다운로드한다.
 * @param items 상품 목록
 * @param fileName 파일명 (확장자 제외)
 */
export function downloadCsv({
  items,
  fileName,
}: {
  items: IProduct[];
  fileName: string;
}) {
  const BOM = "\uFEFF";
  const header = "상품코드,상품명,개수,단위\n";
  const rows = items
    .map(
      (item) =>
        `${escapeCsvField({ value: item.code })},${escapeCsvField({ value: item.name })},${escapeCsvField({ value: item.quantity })},${escapeCsvField({ value: item.unit })}`
    )
    .join("\n");

  const blob = new Blob([BOM + header + rows], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
