import { useMutation } from "@tanstack/react-query";
import { extractProducts } from "~/services/gemini";

export function useImageExtract() {
  return useMutation({
    mutationFn: ({ file }: { file: File }) => {
      return extractProducts({ file });
    },
  });
}
