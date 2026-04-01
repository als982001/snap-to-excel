import { Download, FileText, Trash2 } from "lucide-react";
import type { IProduct } from "~/types";
import type { IProductRow } from "~/types/supabase";

import { useDeleteExtraction } from "../hooks/useDeleteExtraction";
import { useDownload } from "../hooks/useDownload";

interface IExtractionDetailProps {
  extractionId: string;
  imageName: string;
  createdAt: string;
  products: IProductRow[];
  onDeleted: () => void;
}

function toProduct(row: IProductRow): IProduct {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    quantity: row.quantity,
    unit: row.unit,
  };
}

export function ExtractionDetail({
  extractionId,
  imageName,
  createdAt,
  products,
  onDeleted,
}: IExtractionDetailProps) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteExtraction();
  const { handleDownloadXlsx, handleDownloadCsv } = useDownload();

  const items = products.map(toProduct);

  const handleDelete = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    deleteItem({ extractionId }, { onSuccess: onDeleted });
  };

  return (
    <div className="rounded-2xl bg-white shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-color">
        <div>
          <p className="text-sm font-medium text-text-primary">{imageName}</p>
          <p className="text-xs text-text-secondary">
            {new Date(createdAt).toLocaleString("ko-KR")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownloadXlsx({ items })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            xlsx
          </button>

          <button
            type="button"
            onClick={() => handleDownloadCsv({ items, imageName, createdAt })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            csv
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            삭제
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-surface-dark border-b border-border-color">
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
              상품코드
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
              상품명
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
              개수
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
              단위
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-border-color last:border-b-0 hover:bg-surface-dark transition-colors"
            >
              <td className="px-4 py-2.5 text-sm text-text-primary">
                {product.code}
              </td>
              <td className="px-4 py-2.5 text-sm text-text-primary">
                {product.name}
              </td>
              <td className="px-4 py-2.5 text-sm text-text-primary">
                {product.quantity}
              </td>
              <td className="px-4 py-2.5 text-sm text-text-primary">
                {product.unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
