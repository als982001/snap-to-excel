import { useMutation } from "@tanstack/react-query";
import { extractProducts } from "~/services/gemini";
import type { IProduct } from "~/types";

/**
 * 여러 이미지 파일을 순서대로 추출하여 결과를 합친다.
 */
export function useImageExtract() {
  return useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      const allItems: IProduct[] = [];

      for (const file of files) {
        const result = await extractProducts({ file });

        allItems.push(...result.items);
      }

      return { items: allItems };
    },
  });
}
