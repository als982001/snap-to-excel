import { FileSpreadsheet } from "lucide-react";
import type { IProductRow } from "~/types/supabase";

interface IExtractionItem {
  id: string;
  image_name: string;
  created_at: string;
  products: IProductRow[];
}

interface IExtractionListProps {
  extractions: IExtractionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ExtractionList({
  extractions,
  selectedId,
  onSelect,
}: IExtractionListProps) {
  if (extractions.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-md p-8 text-center">
        <FileSpreadsheet className="w-12 h-12 text-text-secondary mx-auto mb-3" />
        <p className="text-text-secondary text-sm">저장된 이력이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-md overflow-hidden">
      {extractions.map((extraction) => {
        const isSelected = extraction.id === selectedId;
        const date = new Date(extraction.created_at).toLocaleDateString(
          "ko-KR",
          { year: "numeric", month: "2-digit", day: "2-digit" }
        );

        return (
          <button
            key={extraction.id}
            type="button"
            onClick={() => onSelect(extraction.id)}
            className={`w-full flex items-center justify-between px-5 py-4 border-b border-border-color last:border-b-0 text-left transition-colors ${
              isSelected ? "bg-surface-highlight" : "hover:bg-surface-dark"
            }`}
          >
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {extraction.image_name}
              </p>
              <p className="text-xs text-text-secondary">{date}</p>
            </div>

            <span className="text-xs text-text-secondary whitespace-nowrap ml-3">
              {extraction.products.length}개 상품
            </span>
          </button>
        );
      })}
    </div>
  );
}
