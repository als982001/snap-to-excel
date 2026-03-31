import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "~/constants/queryKeys";
import { deleteExtraction } from "~/services/extraction";

export function useDeleteExtraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ extractionId }: { extractionId: string }) => {
      return deleteExtraction({ extractionId });
    },
    onSuccess: () => {
      toast.success("삭제되었습니다.");

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.extractions });
    },
    onError: () => {
      toast.error("삭제에 실패했습니다.");
    },
  });
}
