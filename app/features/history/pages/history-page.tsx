import { useState } from "react";

import { Loader2 } from "lucide-react";

import { ExtractionDetail } from "../components/ExtractionDetail";
import { ExtractionList } from "../components/ExtractionList";
import { useExtractionHistory } from "../hooks/useExtractionHistory";

export default function HistoryPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading } = useExtractionHistory();

  const extractions = data?.data ?? [];
  const selected = extractions.find((e) => e.id === selectedId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-text-secondary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">History</h1>

      <ExtractionList
        extractions={extractions}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {selected && (
        <ExtractionDetail
          extractionId={selected.id}
          imageName={selected.image_name}
          createdAt={selected.created_at}
          products={selected.products}
          onDeleted={() => setSelectedId(null)}
        />
      )}

      {!selected && extractions.length > 0 && (
        <div className="rounded-2xl bg-white shadow-md p-8 text-center">
          <p className="text-text-secondary text-sm">이력을 선택해주세요.</p>
        </div>
      )}
    </div>
  );
}
