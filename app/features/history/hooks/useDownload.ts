import { useCallback } from "react";

import type { IProduct } from "~/types";
import { downloadCsv, downloadXlsx } from "~/utils/download";

/**
 * 파일명을 {이미지명}_{YYYY-MM-DD} 형태로 생성한다.
 */
function buildFileName({
  imageName,
  createdAt,
}: {
  imageName: string;
  createdAt: string;
}): string {
  const date = new Date(createdAt).toISOString().split("T")[0];
  const nameWithoutExt = imageName.replace(/\.[^.]+$/, "");

  return `${nameWithoutExt}_${date}`;
}

export function useDownload() {
  const handleDownloadXlsx = useCallback(
    ({
      items,
      imageName,
      createdAt,
    }: {
      items: IProduct[];
      imageName: string;
      createdAt: string;
    }) => {
      const fileName = buildFileName({ imageName, createdAt });

      downloadXlsx({ items, fileName });
    },
    []
  );

  const handleDownloadCsv = useCallback(
    ({
      items,
      imageName,
      createdAt,
    }: {
      items: IProduct[];
      imageName: string;
      createdAt: string;
    }) => {
      const fileName = buildFileName({ imageName, createdAt });

      downloadCsv({ items, fileName });
    },
    []
  );

  return { handleDownloadXlsx, handleDownloadCsv };
}
