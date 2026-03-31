import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "~/constants/queryKeys";
import { useAuth } from "~/contexts/AuthContext";
import { saveExtraction } from "~/services/extraction";
import type { IProduct } from "~/types";

interface ISaveExtractionParams {
  imageName: string;
  items: IProduct[];
}

export function useSaveExtraction() {
  const { context } = useAuth();
  const { user } = context;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageName, items }: ISaveExtractionParams) => {
      if (!user) throw new Error("User must be authenticated");

      return saveExtraction({ userId: user.id, imageName, items });
    },
    onSuccess: () => {
      toast.success("저장되었습니다.");

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.extractions });
    },
    onError: () => {
      toast.error("저장에 실패했습니다.");
    },
  });
}
