import { useState } from "react";

import { Plus, Trash2 } from "lucide-react";
import type { IProduct } from "~/types";

interface IEditingCell {
  rowId: string;
  field: keyof IProduct;
}

interface IProductTableProps {
  items: IProduct[];
  onItemsChange: (items: IProduct[]) => void;
}

export function ProductTable({ items, onItemsChange }: IProductTableProps) {
  const [editingCell, setEditingCell] = useState<IEditingCell | null>(null);

  const handleCellDoubleClick = (rowId: string, field: keyof IProduct) => {
    if (field === "id") return;

    setEditingCell({ rowId, field });
  };

  const handleCellChange = (
    rowId: string,
    field: keyof IProduct,
    value: string
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id !== rowId) return item;

      if (field === "quantity") {
        return { ...item, [field]: parseInt(value) || 0 };
      }

      return { ...item, [field]: value };
    });

    onItemsChange(updatedItems);
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditingCell(null);
    }
  };

  const handleDeleteRow = (rowId: string) => {
    onItemsChange(items.filter((item) => item.id !== rowId));
  };

  const handleAddRow = () => {
    const newItem: IProduct = {
      id: crypto.randomUUID(),
      code: "",
      name: "",
      quantity: 0,
      unit: "EA",
    };

    onItemsChange([...items, newItem]);
  };

  const renderCell = (item: IProduct, field: keyof IProduct) => {
    const isEditing =
      editingCell?.rowId === item.id && editingCell?.field === field;

    if (isEditing) {
      return (
        <input
          type={field === "quantity" ? "number" : "text"}
          value={item[field]}
          onChange={(e) => handleCellChange(item.id, field, e.target.value)}
          onBlur={handleCellBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-2 py-1 border border-primary rounded text-sm outline-none"
        />
      );
    }

    return (
      <span
        onDoubleClick={() => handleCellDoubleClick(item.id, field)}
        className="block px-2 py-1 cursor-pointer hover:bg-surface-highlight rounded text-sm"
      >
        {item[field]}
      </span>
    );
  };

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white shadow-md overflow-hidden">
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
            <th className="px-4 py-3 w-12" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border-color last:border-b-0 hover:bg-surface-dark transition-colors"
            >
              <td className="px-4 py-2">{renderCell(item, "code")}</td>
              <td className="px-4 py-2">{renderCell(item, "name")}</td>
              <td className="px-4 py-2">{renderCell(item, "quantity")}</td>
              <td className="px-4 py-2">{renderCell(item, "unit")}</td>
              <td className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => handleDeleteRow(item.id)}
                  className="p-1 rounded hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-4 py-3 border-t border-border-color">
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />행 추가
        </button>
      </div>
    </div>
  );
}
