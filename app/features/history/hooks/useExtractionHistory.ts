import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constants/queryKeys";
import { useAuth } from "~/contexts/AuthContext";
import { getExtractionHistory } from "~/services/extraction";

export function useExtractionHistory() {
  const { context } = useAuth();
  const { user } = context;

  return useQuery({
    queryKey: QUERY_KEYS.extractions,
    queryFn: () => {
      if (!user) throw new Error("User must be authenticated");

      return getExtractionHistory({ userId: user.id });
    },
    enabled: !!user,
  });
}
