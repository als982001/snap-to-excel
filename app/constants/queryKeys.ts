export const QUERY_KEYS = {
  extractions: ["extractions"] as const,
  extractionDetail: (id: string) => {
    return { key: ["extractions", id] as const };
  },
};
