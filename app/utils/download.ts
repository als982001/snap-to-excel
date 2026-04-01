import ExcelJS from "exceljs";
import type { IProduct } from "~/types";

/**
 * 현재 시각을 YYYY_MM_DD_HH_mm 형태로 반환한다.
 * @return 포맷된 날짜 문자열
 */
function formatDownloadDate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}`;
}

/**
 * 템플릿 엑셀 파일을 기반으로 상품 목록을 xlsx 파일로 다운로드한다.
 * 발주요청서 시트의 4행(A4)부터 코드/품명/수량/단위 순서로 채워넣는다.
 * @param items 상품 목록
 */
export async function downloadXlsx({ items }: { items: IProduct[] }) {
  const response = await fetch("/templates/발주요청서.xlsx");
  const arrayBuffer = await response.arrayBuffer();

  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.getWorksheet("발주요청서");

  if (!worksheet) throw new Error("발주요청서 시트를 찾을 수 없습니다.");

  const START_ROW = 4;

  items.forEach((item, index) => {
    const row = worksheet.getRow(START_ROW + index);

    row.getCell(1).value = item.code;
    row.getCell(2).value = item.name;
    row.getCell(3).value = item.quantity;
    row.getCell(4).value = item.unit;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = `발주요청서_${formatDownloadDate()}`;

  link.href = url;
  link.download = `${fileName}.xlsx`;
  link.click();

  URL.revokeObjectURL(url);
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
